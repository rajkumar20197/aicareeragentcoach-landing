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
const getUserConfirmationEmail = (email) => {
    const isEdu = email.toLowerCase().endsWith('.edu');
    const studentBadge = isEdu ? '<div class="badge" style="background: #8b5cf6;">🎓 Student Early Access Verified</div>' : '';
    const welcomeTitle = isEdu ? 'Student Early Access Activated!' : 'Waitlist Access Confirmed!';

    return {
        Subject: {
            Data: `Waitlist Confirmation - AI Career Agent Coach`,
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
        .header { background: linear-gradient(135deg, #00e5ff 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; }
        .badge { display: inline-block; background: #00e5ff; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin: 10px 0; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://aicareeragentcoach.agency/images/logo.png" alt="AI Career Agent Coach" style="height: 60px; margin-bottom: 10px;">
        </div>
        <div class="content">
            <p>Hello,</p>
            
            <p>This email confirms that we’ve received your request to join the <strong>AI Career Agent Coach</strong> waitlist.</p>

            ${studentBadge}
            
            <p>We’ll notify you when access becomes available or when there are important updates.<br>
            Your email will only be used for waitlist-related communication.</p>

            <p>Thank you for your interest,<br>
            <strong>AI Career Agent Coach Team</strong></p>
            
            <p style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
                <em>Built at Northeastern University</em><br>
                Accelerating careers through AI automation.
            </p>
        </div>
        <div class="footer">
            <p>© 2025 AI Career Agent Coach. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `,
                Charset: 'UTF-8'
            },
            Text: {
                Data: `
Hello,

This email confirms that we’ve received your request to join the AI Career Agent Coach waitlist.

We’ll notify you when access becomes available or when there are important updates.
Your email will only be used for waitlist-related communication.

Thank you for your interest,
AI Career Agent Coach Team

---
Built at Northeastern University
            `,
                Charset: 'UTF-8'
            }
        }
    };
};

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
