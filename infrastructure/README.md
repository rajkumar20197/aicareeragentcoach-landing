# Waitlist Backend Infrastructure

This folder contains the serverless backend infrastructure for the AI Career Agent Coach landing page waitlist.

## 📁 Files

| File | Purpose |
|------|---------|
| `waitlist-handler.js` | Lambda function code for handling email submissions |
| `package.json` | Node.js dependencies for Lambda |
| `cloudformation-waitlist.yaml` | Infrastructure as Code (IaC) template |
| `deploy-waitlist.ps1` | Automated deployment script |
| `API_ENDPOINT.txt` | Saved API endpoint (generated after deployment) |

## 🏗️ Infrastructure Components

### 1. DynamoDB Table
- **Name**: `aicareer-landing-waitlist`
- **Primary Key**: `email` (String)
- **Billing**: Pay-per-request (serverless)
- **Attributes**:
  - `email` - User's email address (primary key)
  - `timestamp` - When they signed up
  - `source` - Always "landing-page"
  - `userAgent` - Browser information
  - `ipAddress` - IP address (for spam prevention)

### 2. Lambda Function
- **Name**: `aicareer-waitlist-handler`
- **Runtime**: Node.js 20.x
- **Memory**: 256 MB
- **Timeout**: 10 seconds
- **Features**:
  - Email validation
  - Duplicate check
  - CORS support
  - Error handling

### 3. API Gateway
- **Name**: `aicareer-landing-waitlist-api`
- **Type**: REST API (Regional)
- **Endpoint**: `POST /waitlist`
- **Stage**: `prod`
- **Features**:
  - CORS enabled
  - Lambda proxy integration
  - No authentication (public endpoint)

## 🚀 Deployment

### Prerequisites
- AWS CLI configured
- PowerShell
- Node.js installed

### Deploy Backend
```powershell
.\infrastructure\deploy-waitlist.ps1
```

This script will:
1. Install Lambda dependencies
2. Package Lambda function
3. Deploy CloudFormation stack
4. Update Lambda code
5. Test the endpoint
6. Save API endpoint to file

### Update Backend
Re-run the same command to update:
```powershell
.\infrastructure\deploy-waitlist.ps1
```

## 🧪 Testing

### Test with curl
```powershell
$endpoint = Get-Content infrastructure/API_ENDPOINT.txt
$body = @{ email = "test@example.com" } | ConvertTo-Json

Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -ContentType "application/json"
```

### Expected Success Response
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "email": "test@example.com"
}
```

### Expected Error Responses
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

```json
{
  "success": true,
  "message": "You are already on the waitlist!",
  "alreadyExists": true
}
```

## 📊 Viewing Waitlist Data

### Using AWS CLI
```powershell
# Scan all emails
aws dynamodb scan --table-name aicareer-landing-waitlist

# Get specific email
aws dynamodb get-item --table-name aicareer-landing-waitlist --key '{"email":{"S":"test@example.com"}}'

# Count total signups
aws dynamodb scan --table-name aicareer-landing-waitlist --select COUNT
```

### Using AWS Console
1. Go to DynamoDB → Tables
2. Select `aicareer-landing-waitlist`
3. Click "Explore table items"

### Export to CSV
```powershell
# Export all emails to JSON
aws dynamodb scan --table-name aicareer-landing-waitlist --output json > waitlist-export.json

# Then parse with PowerShell:
$data = Get-Content waitlist-export.json | ConvertFrom-Json
$data.Items | ForEach-Object { $_.email.S } | Out-File emails.txt
```

## 💰 Cost Estimate

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| DynamoDB | <1000 writes, <1000 reads | **FREE** |
| Lambda | <1000 invocations | **FREE** |
| API Gateway | <1000 requests | **FREE** |
| **TOTAL** | | **$0.00** |

All services are within AWS Free Tier limits for typical landing page traffic.

## 🔒 Security Features

- ✅ Email validation (regex)
- ✅ Duplicate prevention
- ✅ IP address logging (spam detection)
- ✅ CORS restriction (can be tightened)
- ✅ Lambda execution role (least privilege)
- ✅ DynamoDB encryption at rest (default)

## 🗑️ Cleanup

To delete all resources:
```powershell
aws cloudformation delete-stack --stack-name aicareer-landing-waitlist --region us-east-1
```

**Warning**: This will permanently delete all waitlist data!

## 🔧 Troubleshooting

### Lambda not updating?
```powershell
# Force update Lambda code
aws lambda update-function-code --function-name aicareer-waitlist-handler --zip-file fileb://infrastructure/waitlist-function.zip
```

### CORS errors?
Check that `CORS_ORIGIN` environment variable is set to `*` or your domain.

### API returning 500?
Check Lambda logs:
```powershell
aws logs tail /aws/lambda/aicareer-waitlist-handler --follow
```

## 📝 Modifying the Lambda

1. Edit `waitlist-handler.js`
2. Run deployment script:
   ```powershell
   .\infrastructure\deploy-waitlist.ps1
   ```

## 🎯 Next Steps After Deployment

1. Get the API endpoint from `infrastructure/API_ENDPOINT.txt`
2. Update `src/components/WaitlistForm.tsx` with the endpoint
3. Redeploy frontend: `.\deploy-aws.ps1`
4. Test the full flow on your live site
