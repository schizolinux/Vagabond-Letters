import type { RequestHandler } from './$types';
import sql from '$lib/server/db';
import nodemailer from 'nodemailer';

export const GET: RequestHandler = async ({ url }) => {
    // Basic security so not just anyone can trigger emails if this were public
    const cronKey = url.searchParams.get('key');
    if (process.env.CRON_KEY && cronKey !== process.env.CRON_KEY) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const now = Date.now();
        // Find letters that have arrived but haven't had emails sent
        const lettersToNotify = await sql`
            SELECT letters.*,
                   sender.name as sender_name, sender.email as sender_email,
                   recipient.name as recipient_name, recipient.email as recipient_email
            FROM letters
            INNER JOIN users as sender ON letters.sender_id = sender.id
            INNER JOIN users as recipient ON letters.recipient_id = recipient.id
            WHERE arrival_time <= ${now} AND email_sent = 0
        ` as any[];

        if (lettersToNotify.length === 0) {
            return new Response('No new emails to send.', { status: 200 });
        }

        // Setup Nodemailer transporter
        // You will need to set these environment variables in Vercel
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or another service like SendGrid, Resend, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let emailsSent = 0;

        for (const letter of lettersToNotify) {
            try {
                // Determine the base URL for the letter link
                const protocol = process.env.VERCEL_URL ? 'https' : 'http';
                const host = process.env.VERCEL_URL || 'localhost:5173';
                const letterUrl = `${protocol}://${host}/letter/${letter.id}`;

                // Email to the recipient
                await transporter.sendMail({
                    from: `"Vagabond Letters" <${process.env.EMAIL_USER}>`,
                    to: letter.recipient_email,
                    subject: `A letter from ${letter.sender_name} has arrived!`,
                    text: `Dear ${letter.recipient_name},\n\nA letter from ${letter.sender_name} (dispatched from ${letter.from_city}) has finally arrived in ${letter.to_city}.\n\nYou can read it here: ${letterUrl}`,
                    html: `
                        <p>Dear ${letter.recipient_name},</p>
                        <p>A letter from <strong>${letter.sender_name}</strong> (dispatched from ${letter.from_city}) has finally arrived in ${letter.to_city}.</p>
                        <p><a href="${letterUrl}" style="display:inline-block;padding:10px 20px;background-color:#292524;color:white;text-decoration:none;border-radius:5px;">Read your letter</a></p>
                    `
                });

                // Email to the sender (confirmation)
                await transporter.sendMail({
                    from: `"Vagabond Letters" <${process.env.EMAIL_USER}>`,
                    to: letter.sender_email,
                    subject: `Your letter to ${letter.recipient_name} has arrived!`,
                    text: `Dear ${letter.sender_name},\n\nGood news! The letter you sent to ${letter.recipient_name} in ${letter.to_city} has completed its journey and arrived successfully.\n\nThey have been notified via email.`,
                    html: `
                        <p>Dear ${letter.sender_name},</p>
                        <p>Good news! The letter you sent to <strong>${letter.recipient_name}</strong> in ${letter.to_city} has completed its journey and arrived successfully.</p>
                        <p>They have been notified via email.</p>
                    `
                });

                await sql`UPDATE letters SET email_sent = 1 WHERE id = ${letter.id}`;
                emailsSent++;
            } catch (err) {
                console.error(`Failed to send email for letter ${letter.id}:`, err);
                // In a production app, we might want to retry later, but for now we'll just log it.
            }
        }

        return new Response(`Successfully processed ${lettersToNotify.length} letters. Sent ${emailsSent * 2} emails.`, { status: 200 });
    } catch (error) {
        console.error('Cron job error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
