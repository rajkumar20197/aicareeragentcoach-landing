// AI Career Agent Coach - Enhanced Waitlist Handler with Email Notifications
// Handles email submissions and sends confirmation emails via SES

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } = require('@aws-sdk/client-ses');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

const TABLE_NAME = process.env.TABLE_NAME || 'aicareer-landing-waitlist';
const PARTNERSHIP_TABLE_NAME = process.env.PARTNERSHIP_TABLE_NAME || 'aicareer-landing-partnerships';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rajkumarthota20197@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'rajkumarthota20197@gmail.com';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aicareer2025';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email templates
const getOTPVerificationEmail = (otp) => ({
    Subject: {
        Data: `Your Verification Code: ${otp}`,
        Charset: 'UTF-8'
    },
    Body: {
        Html: {
            Data: `
<!DOCTYPE html>
<html>
<body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: #f9fafb;">
    <div style="max-width: 500px; margin: 40px auto; padding: 40px; border-radius: 24px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #00e5ff; text-align: center; font-size: 24px;">AI Career Agent Coach</h1>
        <p style="font-size: 16px; color: #4b5563; text-align: center;">Your one-time verification code is:</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111827;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't request this, please ignore this email.</p>
    </div>
</body>
</html>`,
            Charset: 'UTF-8'
        }
    }
});

const getUserConfirmationEmail = (email) => {
    return {
        Subject: {
            Data: `Welcome to AI Career Agent Coach - Waitlist Confirmed`,
            Charset: 'UTF-8'
        },
        Body: {
            Html: {
                Data: `
<!DOCTYPE html>
<html>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background: #f9fafb;">
    <div style="max-width: 600px; margin: 40px auto; padding: 40px; border-radius: 24px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #00e5ff; text-align: center; margin-bottom: 30px;">AI Career Agent Coach</h1>
        <p style="font-size: 18px; color: #111827; font-weight: 600;">You're on the list!</p>
        <p style="font-size: 16px; color: #4b5563;">Thank you for joining the waitlist. You've successfully reserved your spot for early access to the future of career automation.</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Next Steps:</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #4b5563;">
                <li>Real-time development updates</li>
                <li>Exclusive beta access invites</li>
                <li>Early-bird pricing when we launch</li>
            </ul>
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="font-size: 14px; color: #9ca3af; text-align: center;">Built for the ambitious. Empowering the next generation of global talent.</p>
    </div>
</body>
</html>`,
                Charset: 'UTF-8'
            }
        }
    };
};

const getPartnershipConfirmationEmail = (email) => ({
    Subject: {
        Data: `Partnership Inquiry Received - AI Career Agent Coach`,
        Charset: 'UTF-8'
    },
    Body: {
        Html: {
            Data: `
<!DOCTYPE html>
<html>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background: #f9fafb;">
    <div style="max-width: 600px; margin: 40px auto; padding: 40px; border-radius: 24px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #8b5cf6; text-align: center; margin-bottom: 30px;">AI Career Agent Coach</h1>
        <p style="font-size: 18px; color: #111827; font-weight: 600;">Partnership Inquiry Received</p>
        <p style="font-size: 16px; color: #4b5563;">Thank you for expressing interest in a strategic partnership with AI Career Agent Coach. We are thrilled to connect with visionaries who want to redefine the career cycle.</p>
        <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">What's Next:</p>
            <p style="margin: 10px 0 0 0; color: #4b5563;">Our founding team will review your inquiry and reach out via this email to schedule a discovery call within the next 48 hours.</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="font-size: 14px; color: #9ca3af; text-align: center;">Building the future of AI-driven career growth, together.</p>
    </div>
</body>
</html>`,
            Charset: 'UTF-8'
        }
    }
});

const getAdminNotificationEmail = (email, type, timestamp, ipAddress) => ({
    Subject: {
        Data: `🔔 New ${type === 'verified' ? 'LIVE' : 'QUEUE'} Signup: ${email}`,
        Charset: 'UTF-8'
    },
    Body: {
        Html: {
            Data: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>New Signup Alert</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
    <p><strong>IP:</strong> ${ipAddress}</p>
</body>
</html>`,
            Charset: 'UTF-8'
        }
    }
});

async function sendEmail(toEmail, emailContent, fromEmail) {
    try {
        await sesClient.send(new SendEmailCommand({
            Source: fromEmail,
            Destination: { ToAddresses: [toEmail] },
            Message: emailContent
        }));
    } catch (err) {
        console.error(`Email send error: ${err.message}`);
        throw err; // Rethrow to inform the caller
    }
}

async function triggerVerification(email) {
    try {
        await sesClient.send(new VerifyEmailIdentityCommand({ EmailAddress: email }));
        console.log(`Triggered SES verification for ${email}`);
    } catch (err) {
        console.error(`Verification trigger error: ${err.message}`);
    }
}

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type,x-admin-secret',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) };

    try {
        if (event.httpMethod === 'GET') {
            const queryParams = event.queryStringParameters || {};
            const type = queryParams.type || 'standard';
            const isCount = event.path?.endsWith('/count') || event.resource?.endsWith('/count') || !event.headers['x-admin-secret'];

            const targetTable = type === 'partnership' ? PARTNERSHIP_TABLE_NAME : TABLE_NAME;

            if (isCount) {
                const data = await docClient.send(new ScanCommand({ TableName: targetTable, Select: "COUNT" }));
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, count: data.Count || 0 })
                };
            } else {
                // Admin access to list emails
                const providedSecret = event.headers['x-admin-secret'];
                if (providedSecret !== ADMIN_SECRET) {
                    return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Unauthorized' }) };
                }
                const data = await docClient.send(new ScanCommand({ TableName: targetTable }));
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, items: data.Items || [] })
                };
            }
        }

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const email = body.email?.toLowerCase().trim();
            const action = body.action || 'signup'; // 'signup', 'send_otp', 'verify_otp'

            if (!email || !EMAIL_REGEX.test(email)) {
                return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Invalid email' }) };
            }

            const timestamp = new Date().toISOString();
            const ip = event.requestContext?.identity?.sourceIp || 'unknown';

            try {
                if (action === 'partnership') {
                    await docClient.send(new PutCommand({
                        TableName: PARTNERSHIP_TABLE_NAME,
                        Item: {
                            email,
                            timestamp,
                            ipAddress: ip,
                            subscriptionType: 'partnership',
                            source: 'web'
                        }
                    }));

                    // We wrap emails in a separate try-catch so registration succeeds even if SES is in Sandbox
                    try {
                        await Promise.all([
                            sendEmail(ADMIN_EMAIL, getAdminNotificationEmail(email, 'partnership', timestamp, ip), FROM_EMAIL),
                            sendEmail(email, getPartnershipConfirmationEmail(email), FROM_EMAIL)
                        ]);
                    } catch (emailErr) {
                        console.warn('Email notification failed (likely SES Sandbox):', emailErr.message);
                    }

                    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Inquiry received!' }) };
                }

                // --- Standard Signup ---
                await docClient.send(new PutCommand({
                    TableName: TABLE_NAME,
                    Item: {
                        email,
                        timestamp,
                        ipAddress: ip,
                        subscriptionType: 'standard',
                        source: 'web'
                    }
                }));

                try {
                    await Promise.all([
                        sendEmail(ADMIN_EMAIL, getAdminNotificationEmail(email, 'standard', timestamp, ip), FROM_EMAIL),
                        sendEmail(email, getUserConfirmationEmail(email), FROM_EMAIL)
                    ]);
                } catch (emailErr) {
                    console.warn('Email notification failed (likely SES Sandbox):', emailErr.message);
                }

                return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Joined waitlist!' }) };
            } catch (dbErr) {
                console.error('Database Error:', dbErr);
                throw dbErr;
            }
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not Found' }) };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
            })
        };
    }
};
