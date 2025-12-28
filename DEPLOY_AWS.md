# 🚀 AWS Deployment Guide - aicareeragentcoach.agency

Complete guide to deploy your Coming Soon page to AWS with your custom domain.

---

## 📋 What You'll Deploy

**Stack:**
- **S3 Bucket** - Hosts your static files
- **CloudFront** - Global CDN for fast delivery
- **ACM Certificate** - Free SSL/HTTPS
- **Route 53** - DNS for aicareeragentcoach.agency

**Cost:** ~$0.50-$1.00/month (first year free tier eligible)

---

## 🔧 Prerequisites

1. ✅ AWS Account (your personal account)
2. ✅ Domain `aicareeragentcoach.agency` registered
3. ✅ AWS CLI installed
4. ✅ Your coming-soon page built

---

## 📝 Step 1: Build Your Production Site

```powershell
# Navigate to coming-soon folder
cd e:\Level_up\AWS_Cloud_Project_Career-Copilot\coming-soon

# Build for production
npm run build
```

This creates a `dist/` folder with optimized files.

---

## ☁️ Step 2: Create S3 Bucket

```powershell
# Create bucket (use us-east-1 for CloudFront)
aws s3 mb s3://aicareeragentcoach.agency --region us-east-1

# Enable static website hosting
aws s3 website s3://aicareeragentcoach.agency --index-document index.html --error-document index.html
```

---

## 📤 Step 3: Upload Your Site

```powershell
# Upload dist folder to S3
aws s3 sync dist/ s3://aicareeragentcoach.agency --delete

# Set correct content types
aws s3 cp dist/ s3://aicareeragentcoach.agency --recursive --exclude "*" --include "*.html" --content-type "text/html"
aws s3 cp dist/ s3://aicareeragentcoach.agency --recursive --exclude "*" --include "*.css" --content-type "text/css"  
aws s3 cp dist/ s3://aicareeragentcoach.agency --recursive --exclude "*" --include "*.js" --content-type "application/javascript"
aws s3 cp dist/ s3://aicareeragentcoach.agency --recursive --exclude "*" --include "*.png" --content-type "image/png"
```

---

## 🔐 Step 4: Make Bucket Public (for website)

```powershell
# Create bucket policy file
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::aicareeragentcoach.agency/*"
    }
  ]
}
"@ | Out-File -FilePath bucket-policy.json -Encoding UTF8

# Apply policy
aws s3api put-bucket-policy --bucket aicareeragentcoach.agency --policy file://bucket-policy.json

# Disable block public access
aws s3api put-public-access-block --bucket aicareeragentcoach.agency --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

---

## 🌍 Step 5: Request SSL Certificate (ACM)

**IMPORTANT:** Certificate MUST be in **us-east-1** for CloudFront!

```powershell
# Request certificate
aws acm request-certificate `
  --domain-name aicareeragentcoach.agency `
  --validation-method DNS `
  --subject-alternative-names "www.aicareeragentcoach.agency" `
  --region us-east-1
```

**Copy the Certificate ARN from the output!**

Then:
1. Go to AWS Console → ACM (us-east-1 region)
2. Click on your certificate
3. Click "Create records in Route 53" button
4. Wait ~5-10 minutes for validation

---

## 🚀 Step 6: Create CloudFront Distribution

```powershell
# Create CloudFront distribution config
@"
{
  "CallerReference": "aicareeragentcoach-$(Get-Date -Format 'yyyyMMddHHmmss')",
  "Comment": "AI Career Agent Coach - Coming Soon",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-aicareeragentcoach.agency",
        "DomainName": "aicareeragentcoach.agency.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-aicareeragentcoach.agency",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "Compress": true
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["aicareeragentcoach.agency", "www.aicareeragentcoach.agency"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "YOUR_CERTIFICATE_ARN_HERE",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  }
}
"@ | Out-File -FilePath cloudfront-config.json -Encoding UTF8
```

**Replace `YOUR_CERTIFICATE_ARN_HERE` with your actual ACM certificate ARN!**

Then create the distribution:
```powershell
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**Copy the CloudFront Distribution Domain** (e.g., `d111111abcdef8.cloudfront.net`)

---

## 🌐 Step 7: Configure Route 53 DNS

### Option A: Domain Already in Route 53
```powershell
# Get your hosted zone ID
aws route53 list-hosted-zones-by-name --dns-name aicareeragentcoach.agency

# Create DNS records pointing to CloudFront
# Replace HOSTED_ZONE_ID and CLOUDFRONT_DOMAIN_NAME
@"
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "aicareeragentcoach.agency",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DOMAIN_NAME",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.aicareeragentcoach.agency",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DOMAIN_NAME",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
"@ | Out-File -FilePath route53-changes.json -Encoding UTF8

aws route53 change-resource-record-sets --hosted-zone-id YOUR_HOSTED_ZONE_ID --change-batch file://route53-changes.json
```

### Option B: Domain at External Registrar (GoDaddy, Namecheap, etc.)

Add these DNS records at your registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | `YOUR_CLOUDFRONT_DOMAIN.cloudfront.net` |
| CNAME | www | `YOUR_CLOUDFRONT_DOMAIN.cloudfront.net` |

---

## ✅ Step 8: Verify Deployment

Wait 5-15 minutes for DNS propagation, then visit:
- https://aicareeragentcoach.agency
- https://www.aicareeragentcoach.agency

---

## 🔄 Future Updates

When you make changes:

```powershell
# 1. Rebuild
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://aicareeragentcoach.agency --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| S3 Storage | ~$0.023/GB/month |
| CloudFront | ~$0.085/GB transferred |
| Route 53 | $0.50/month (hosted zone) |
| ACM Certificate | **FREE** |

**Estimated monthly cost:** $0.50 - $2.00 (depends on traffic)

---

## 🎯 Quick Deployment Script

I'll create an automated script for you in the next file!

---

## 📝 Troubleshooting

### Issue: CloudFront shows S3 XML error
- Check bucket policy is applied
- Verify static website hosting is enabled
- Check CloudFront origin is pointing to website endpoint (not REST endpoint)

### Issue: SSL certificate not validating
- Ensure certificate is in **us-east-1** region
- Check DNS validation records are created in Route 53
- Wait up to 30 minutes for validation

### Issue: Page not loading
- Check CloudFront distribution is**"Deployed"** status
- Verify DNS records are correct
- Clear browser cache and try incognito mode

---

**Your site will be live at `https://aicareeragentcoach.agency` in ~15-20 minutes!** 🎉
