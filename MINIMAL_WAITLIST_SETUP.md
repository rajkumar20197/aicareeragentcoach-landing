# 🎯 Minimal AWS Setup for Waitlist (FREE Tier)

**Goal:** Collect waitlist emails with $0 monthly cost

---

## ✅ DNS Status (FROM YOUR NAMECHEAP)

Based on your screenshot, your DNS is **correctly configured**:

```
CNAME Record: @ → d2upslr8577vx4.cloudfront.net
CNAME Record: www → d2upslr8577vx4.cloudfront.net
```

✅ This points `aicareeragentcoach.agency` to your CloudFront distribution  
✅ SSL/HTTPS should be working via CloudFront  

---

## 📦 MINIMUM AWS Services Needed for Waitlist

To make the waitlist work, you need these **3 services ONLY**:

### 1. **DynamoDB** (Database for emails)
- **Table Name:** `aicareer-landing-waitlist`
- **Cost:** **$0/month** (Free tier: 25GB storage, 25 WCU/RCU)
- **Purpose:** Store email addresses with timestamps

### 2. **Lambda** (Process form submissions)
- **Function Name:** `aicareer-waitlist-handler`
- **Runtime:** Node.js 20.x
- **Cost:** **$0/month** (Free tier: 1M requests/month)
- **Purpose:** Validate emails, prevent duplicates, save to DynamoDB

### 3. **API Gateway** (REST API endpoint)
- **API Name:** `aicareer-landing-waitlist-api`
- **Type:** REST API (Regional)
- **Cost:** **$0/month** (Free tier: 1M requests/month)
- **Purpose:** Provide HTTPS endpoint for your website form

---

## 💰 Total Monthly Cost: $0.00

**Free Tier Limits:**
- DynamoDB: Up to 25GB storage (your waitlist will use ~1MB)
- Lambda: 1 million requests/month (even 1000 signups/day is only 30K/month)
- API Gateway: 1 million requests/month
- **NO ongoing charges** unless you exceed these limits

**What we're NOT using (to save costs):**
- ❌ EC2 instances (would cost money)
- ❌ RDS databases (would cost money)
- ❌ No SES email sending (unless you want confirmation emails)
- ❌ No CloudWatch detailed monitoring (basic logs are free)

---

## 🚀 Deployment Plan

### Option 1: CloudFormation (Recommended - Automated)

Deploy everything with one command:

```powershell
# This creates all 3 services in one stack
aws cloudformation create-stack `
  --stack-name aicareer-waitlist-minimal `
  --template-body file://infrastructure/cloudformation-waitlist.yaml `
  --capabilities CAPABILITY_NAMED_IAM `
  --region us-east-1

# Wait for completion (2-3 minutes)
aws cloudformation wait stack-create-complete `
  --stack-name aicareer-waitlist-minimal `
  --region us-east-1

# Get the API endpoint URL
aws cloudformation describe-stacks `
  --stack-name aicareer-waitlist-minimal `
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" `
  --output text
```

**What this creates:**
- ✅ DynamoDB table
- ✅ Lambda function with basic code
- ✅ API Gateway with CORS enabled
- ✅ IAM roles (minimal permissions)

---

### Option 2: Manual Setup (Step by Step)

If you want more control:

#### Step 1: Create DynamoDB Table
```powershell
aws dynamodb create-table `
  --table-name aicareer-landing-waitlist `
  --attribute-definitions AttributeName=email,AttributeType=S `
  --key-schema AttributeName=email,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region us-east-1
```

#### Step 2: Create IAM Role for Lambda
```powershell
# Create trust policy
$trustPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Principal = @{ Service = "lambda.amazonaws.com" }
            Action = "sts:AssumeRole"
        }
    )
} | ConvertTo-Json -Depth 5

$trustPolicy | Out-File -FilePath trust-policy.json -Encoding UTF8

# Create role
aws iam create-role `
  --role-name aicareer-waitlist-lambda-role `
  --assume-role-policy-document file://trust-policy.json

# Attach basic execution policy
aws iam attach-role-policy `
  --role-name aicareer-waitlist-lambda-role `
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create DynamoDB access policy
$dynamoPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @("dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan")
            Resource = "arn:aws:dynamodb:us-east-1:980826468182:table/aicareer-landing-waitlist"
        }
    )
} | ConvertTo-Json -Depth 5

$dynamoPolicy | Out-File -FilePath dynamo-policy.json -Encoding UTF8

aws iam put-role-policy `
  --role-name aicareer-waitlist-lambda-role `
  --policy-name DynamoDBAccess `
  --policy-document file://dynamo-policy.json
```

#### Step 3: Create Lambda Function
```powershell
# Package the code
cd infrastructure
npm install
Compress-Archive -Path waitlist-handler.js,node_modules -DestinationPath lambda.zip -Force

# Create function
aws lambda create-function `
  --function-name aicareer-waitlist-handler `
  --runtime nodejs20.x `
  --handler waitlist-handler.handler `
  --role arn:aws:iam::980826468182:role/aicareer-waitlist-lambda-role `
  --zip-file fileb://lambda.zip `
  --timeout 10 `
  --memory-size 256 `
  --environment Variables={TABLE_NAME=aicareer-landing-waitlist,CORS_ORIGIN=*} `
  --region us-east-1
```

#### Step 4: Create API Gateway
```powershell
# Create REST API
$apiId = (aws apigateway create-rest-api `
  --name aicareer-landing-waitlist-api `
  --description "Waitlist API" `
  --region us-east-1 `
  --query 'id' `
  --output text)

# Get root resource ID
$rootId = (aws apigateway get-resources `
  --rest-api-id $apiId `
  --query 'items[0].id' `
  --output text)

# Create /waitlist resource
$resourceId = (aws apigateway create-resource `
  --rest-api-id $apiId `
  --parent-id $rootId `
  --path-part waitlist `
  --query 'id' `
  --output text)

# Create POST method
aws apigateway put-method `
  --rest-api-id $apiId `
  --resource-id $resourceId `
  --http-method POST `
  --authorization-type NONE

# Create GET method (for count)
aws apigateway put-method `
  --rest-api-id $apiId `
  --resource-id $resourceId `
  --http-method GET `
  --authorization-type NONE

# Lambda integration URI
$lambdaArn = "arn:aws:lambda:us-east-1:980826468182:function:aicareer-waitlist-handler"
$integrationUri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/$lambdaArn/invocations"

# Integrate POST with Lambda
aws apigateway put-integration `
  --rest-api-id $apiId `
  --resource-id $resourceId `
  --http-method POST `
  --type AWS_PROXY `
  --integration-http-method POST `
  --uri $integrationUri

# Integrate GET with Lambda
aws apigateway put-integration `
  --rest-api-id $apiId `
  --resource-id $resourceId `
  --http-method GET `
  --type AWS_PROXY `
  --integration-http-method POST `
  --uri $integrationUri

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission `
  --function-name aicareer-waitlist-handler `
  --statement-id apigateway-access `
  --action lambda:InvokeFunction `
  --principal apigateway.amazonaws.com `
  --source-arn "arn:aws:execute-api:us-east-1:980826468182:$apiId/*/*"

# Deploy API
$deploymentId = (aws apigateway create-deployment `
  --rest-api-id $apiId `
  --stage-name prod `
  --query 'id' `
  --output text)

# Show endpoint URL
Write-Host "`nAPI Endpoint: https://$apiId.execute-api.us-east-1.amazonaws.com/prod/waitlist" -ForegroundColor Green
```

---

## 🔧 After Deployment

### 1. Update Frontend with New API Endpoint

Edit `src/components/WaitlistForm.tsx`:

```typescript
// Line 14 - Update GET request URL
const response = await fetch('https://YOUR_NEW_API_ID.execute-api.us-east-1.amazonaws.com/prod/waitlist', {

// Line 43 - Update POST request URL
const response = await fetch('https://YOUR_NEW_API_ID.execute-api.us-east-1.amazonaws.com/prod/waitlist', {
```

### 2. Rebuild and Deploy Frontend

```powershell
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://aicareeragentcoach.agency/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation `
  --distribution-id E3J96WC7WKFJ45 `
  --paths "/*"
```

---

## 📊 Monitor Your Resources

### Check DynamoDB for signups:
```powershell
# Count entries
aws dynamodb scan `
  --table-name aicareer-landing-waitlist `
  --select COUNT `
  --region us-east-1

# View all entries
aws dynamodb scan `
  --table-name aicareer-landing-waitlist `
  --region us-east-1
```

### Check Lambda logs:
```powershell
# View recent logs
aws logs tail /aws/lambda/aicareer-waitlist-handler `
  --follow `
  --region us-east-1
```

### Test API directly:
```powershell
# GET request (count)
Invoke-RestMethod -Uri "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/waitlist" -Method GET

# POST request (submit email)
$body = @{ email = "test@example.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/waitlist" -Method POST -Body $body -ContentType "application/json"
```

---

## 💡 Cost Monitoring Tips

### Set up billing alerts:
```powershell
# Create billing alarm (alerts if cost exceeds $1)
aws cloudwatch put-metric-alarm `
  --alarm-name "AWS-Billing-Alert-1USD" `
  --alarm-description "Alert when bill exceeds $1" `
  --metric-name EstimatedCharges `
  --namespace AWS/Billing `
  --statistic Maximum `
  --period 21600 `
  --evaluation-periods 1 `
  --threshold 1.0 `
  --comparison-operator GreaterThanThreshold `
  --region us-east-1
```

### Check current costs:
```powershell
# View cost and usage
aws ce get-cost-and-usage `
  --time-period Start=2026-01-01,End=2026-01-11 `
  --granularity MONTHLY `
  --metrics BlendedCost `
  --region us-east-1
```

---

## 🗑️ How to Delete Everything (If Needed)

### If using CloudFormation:
```powershell
aws cloudformation delete-stack `
  --stack-name aicareer-waitlist-minimal `
  --region us-east-1
```

### If manual setup:
```powershell
# Delete API Gateway
aws apigateway delete-rest-api --rest-api-id YOUR_API_ID --region us-east-1

# Delete Lambda
aws lambda delete-function --function-name aicareer-waitlist-handler --region us-east-1

# Delete DynamoDB (WARNING: deletes all data)
aws dynamodb delete-table --table-name aicareer-landing-waitlist --region us-east-1

# Delete IAM role
aws iam delete-role-policy --role-name aicareer-waitlist-lambda-role --policy-name DynamoDBAccess
aws iam detach-role-policy --role-name aicareer-waitlist-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name aicareer-waitlist-lambda-role
```

---

## 🎯 What You Keep (Existing Resources)

These are ACTIVE and should remain:
- ✅ **S3 Bucket:** `aicareeragentcoach.agency` (your website)
- ✅ **CloudFront Distribution:** `E3J96WC7WKFJ45` (CDN + HTTPS)
- ✅ **ACM Certificate:** For SSL/TLS
- ✅ **Route 53 or Namecheap DNS:** Domain configuration

**Monthly cost for these:** ~$1-2 (mostly Route 53 hosted zone if using it)

---

## 📋 Summary

**To make waitlist work, you ONLY need:**
1. DynamoDB table (FREE)
2. Lambda function (FREE)
3. API Gateway (FREE)

**Total new cost:** $0.00/month

**Your existing resources stay untouched** - we're just adding the minimal backend needed for the form to work.

---

**Ready to deploy?** Choose Option 1 (CloudFormation) or Option 2 (Manual), and I'll help you through it! 🚀
