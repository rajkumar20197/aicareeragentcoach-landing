// AI Career Agent Coach - Enhanced Waitlist Handler with Email Notifications
// Handles email submissions and sends confirmation emails via SES

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});

const TABLE_NAME = process.env.TABLE_NAME || 'aicareer-landing-waitlist';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''; // Set this in environment variables
const FROM_EMAIL = process.env.FROM_EMAIL || ''; // Must be verified in SES

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email templates
const getUserConfirmationEmail = (email) => ({
    Subject: {
        Data: '🎉 Welcome to AI Career Agent Coach - You\'re on the List!',
        Charset: 'UTF-8'
    },
    Body: {
        Html: {
            Data: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00e5ff 0%, #b86dff 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; }
        .badge { display: inline-block; background: #00e5ff; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #00e5ff 0%, #b86dff 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 You're In!</h1>
        </div>
        <div class="content">
            <h2>Welcome to the AI Career Agent Coach Waitlist</h2>
            <p>Hey there! 👋</p>
            <p>Thanks for joining our launch list. You're now part of an exclusive group of ambitious professionals who are getting early access to the future of job hunting.</p>
            
            <div class="badge">✓ Founding Member Status: Activated</div>
            
            <h3>What happens next?</h3>
            <ul>
                <li><strong>Early Access:</strong> You'll be first to try AI Career Agent Coach when we launch</li>
                <li><strong>Exclusive Benefits:</strong> Founding members get special perks and discounts</li>
                <li><strong>Launch Updates:</strong> We'll keep you posted on our progress</li>
            </ul>
            
            <p><strong>Your registered email:</strong> ${email}</p>
            
            <p style="margin-top: 30px;">We're working hard to build something amazing. The old way of job hunting dies here.</p>
            
            <p>Stay tuned! 🎯</p>
            
            <p style="margin-top: 30px;">
                <strong>The AI Career Agent Team</strong><br>
                <em>Built by students, for the ambitious</em>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 AI Career Agent Coach. All rights reserved.</p>
            <p>You're receiving this because you joined our waitlist at aicareeragentcoach.agency</p>
        </div>
    </div>
</body>
</html>
            `,
            Charset: 'UTF-8'
        },
        Text: {
            Data: `
Welcome to AI Career Agent Coach!

You're now on our exclusive launch list.

What happens next:
- Early Access: You'll be first to try AI Career Agent Coach when we launch
- Exclusive Benefits: Founding members get special perks and discounts  
- Launch Updates: We'll keep you posted on our progress

Your registered email: ${email}

We're working hard to build something amazing. The old way of job hunting dies here.

Stay tuned!

The AI Career Agent Team
Built by students, for the ambitious

---
© 2025 AI Career Agent Coach
You're receiving this because you joined our waitlist at aicareeragentcoach.agency
            `,
            Charset: 'UTF-8'
        }
    }
});

const getAdminNotificationEmail = (email, timestamp, ipAddress) => ({
    Subject: {
        Data: `🔔 New Waitlist Signup: ${email}`,
        Charset: 'UTF-8'
    },
    Body: {
        Html: {
            Data: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>New Waitlist Signup</h2>
    <p>Someone just joined your waitlist!</p>
    <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 8px; background: #f5f5f5;"><strong>Email:</strong></td>
            <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
            <td style="padding: 8px; background: #f5f5f5;"><strong>Time:</strong></td>
            <td style="padding: 8px;">${new Date(timestamp).toLocaleString()}</td>
        </tr>
        <tr>
            <td style="padding: 8px; background: #f5f5f5;"><strong>IP Address:</strong></td>
            <td style="padding: 8px;">${ipAddress}</td>
        </tr>
    </table>
    <p><a href="https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?table=aicareer-landing-waitlist">View in DynamoDB</a></p>
</body>
</html>
            `,
            Charset: 'UTF-8'
        },
        Text: {
            Data: `
New Waitlist Signup

Email: ${email}
Time: ${new Date(timestamp).toLocaleString()}
IP Address: ${ipAddress}

View all signups in AWS Console:
https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#item-explorer?table=aicareer-landing-waitlist
            `,
            Charset: 'UTF-8'
        }
    }
});

// Send email via SES
async function sendEmail(toEmail, emailContent, fromEmail) {
    if (!fromEmail) {
        console.log('FROM_EMAIL not configured, skipping email send');
        return;
    }

    const params = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [toEmail]
        },
        Message: emailContent
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
        console.log(`Email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${toEmail}:`, error);
        // Don't fail the request if email fails
    }
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'changeme';

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-admin-secret',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // Handle GET /signups (Admin access)
    if (event.httpMethod === 'GET') {
        const providedSecret = event.headers?.['x-admin-secret'] || event.queryStringParameters?.secret;

        if (!providedSecret || providedSecret !== ADMIN_SECRET) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ success: false, error: 'Unauthorized' })
            };
        }

        try {
            const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
            const data = await docClient.send(new ScanCommand({
                TableName: TABLE_NAME
            }));

            // Sort by timestamp descending
            const signups = (data.Items || []).sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    count: signups.length,
                    signups
                })
            };
        } catch (error) {
            console.error('Error fetching signups:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: 'Failed to fetch signups' })
            };
        }
    }

    try {
        // Parse request body
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON in request body'
                })
            };
        }

        const { email } = body;

        // Validate email
        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Email is required'
                })
            };
        }

        if (!EMAIL_REGEX.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email format'
                })
            };
        }

        // Normalize email (lowercase)
        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already exists
        try {
            const getResult = await docClient.send(new GetCommand({
                TableName: TABLE_NAME,
                Key: { email: normalizedEmail }
            }));

            if (getResult.Item) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'You are already on the waitlist!',
                        alreadyExists: true
                    })
                };
            }
        } catch (error) {
            console.error('Error checking existing email:', error);
        }

        // Store email in DynamoDB
        const timestamp = new Date().toISOString();
        const ipAddress = event.requestContext?.identity?.sourceIp || 'unknown';
        const userAgent = event.headers?.['User-Agent'] || 'unknown';

        const item = {
            email: normalizedEmail,
            timestamp,
            source: 'landing-page',
            userAgent,
            ipAddress
        };

        await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item,
            ConditionExpression: 'attribute_not_exists(email)'
        }));

        console.log('Email stored successfully:', normalizedEmail);

        // Send confirmation email to user
        if (FROM_EMAIL) {
            await sendEmail(
                normalizedEmail,
                getUserConfirmationEmail(normalizedEmail),
                FROM_EMAIL
            );
        }

        // Send notification to admin
        if (ADMIN_EMAIL && FROM_EMAIL) {
            await sendEmail(
                ADMIN_EMAIL,
                getAdminNotificationEmail(normalizedEmail, timestamp, ipAddress),
                FROM_EMAIL
            );
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Successfully joined the waitlist! Check your email for confirmation.',
                email: normalizedEmail
            })
        };

    } catch (error) {
        console.error('Error:', error);

        // Handle duplicate email error
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'You are already on the waitlist!',
                    alreadyExists: true
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to process request. Please try again.'
            })
        };
    }
};
