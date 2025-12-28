# 🚀 Quick AWS Deployment Script
# Deploys Coming Soon page to aicareeragentcoach.agency

param(
    [Parameter(Mandatory = $false)]
    [string]$CertificateArn = "",
    
    [Parameter(Mandatory = $false)]
    [string]$DistributionId = ""
)

Write-Host "`n🚀 AI Career Agent Coach - AWS Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$BUCKET_NAME = "aicareeragentcoach.agency"
$REGION = "us-east-1"
$DOMAIN = "aicareeragentcoach.agency"

# Step 1: Build production site
Write-Host "📦 Step 1: Building production site..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build complete!`n" -ForegroundColor Green

# Step 2: Check if bucket exists
Write-Host "☁️  Step 2: Checking S3 bucket..." -ForegroundColor Yellow

$bucketExists = aws s3 ls s3://$BUCKET_NAME 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Creating bucket: $BUCKET_NAME" -ForegroundColor Gray
    aws s3 mb s3://$BUCKET_NAME --region $REGION
    
    # Enable static website hosting
    aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
    
    # Create and apply bucket policy
    @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
"@ | Out-File -FilePath bucket-policy.json -Encoding UTF8
    
    aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
    aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    
    Remove-Item bucket-policy.json
    Write-Host "✅ Bucket created and configured!`n" -ForegroundColor Green
}
else {
    Write-Host "✅ Bucket already exists!`n" -ForegroundColor Green
}

# Step 3: Upload files to S3
Write-Host "📤 Step 3: Uploading files to S3..." -ForegroundColor Yellow

aws s3 sync dist/ s3://$BUCKET_NAME --delete --no-progress

# Set correct content types
Write-Host "   Setting content types..." -ForegroundColor Gray
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --exclude "*" --include "*.html" --content-type "text/html" --metadata-directive REPLACE --no-progress
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --exclude "*" --include "*.css" --content-type "text/css" --metadata-directive REPLACE --no-progress
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --exclude "*" --include "*.js" --content-type "application/javascript" --metadata-directive REPLACE --no-progress
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME --recursive --exclude "*" --include "*.png" --content-type "image/png" --metadata-directive REPLACE --no-progress

Write-Host "✅ Files uploaded!`n" -ForegroundColor Green

# Step 4: Invalidate CloudFront cache (if distribution exists)
if ($DistributionId) {
    Write-Host "🔄 Step 4: Invalidating CloudFront cache..." -ForegroundColor Yellow
    $invalidation = aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" --output json | ConvertFrom-Json
    Write-Host "✅ Cache invalidation started (ID: $($invalidation.Invalidation.Id))`n" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Step 4: Skipped (No CloudFront distribution ID provided)" -ForegroundColor Yellow
    Write-Host "   Provide -DistributionId parameter to auto-invalidate cache`n" -ForegroundColor Gray
}

# Success!
Write-Host "🎉 DEPLOYMENT COMPLETE!`n" -ForegroundColor Green

Write-Host "📍 Your site is accessible at:" -ForegroundColor Cyan
Write-Host "   S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor White

if ($DistributionId) {
    Write-Host "   CloudFront: https://$DOMAIN (wait 5-10 min for cache invalidation)" -ForegroundColor White
}
else {
    Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Set up SSL certificate in ACM (us-east-1)" -ForegroundColor White
    Write-Host "   2. Create CloudFront distribution" -ForegroundColor White
    Write-Host "   3. Configure Route 53 DNS" -ForegroundColor White
    Write-Host "   4. Re-run with: .\deploy-aws.ps1 -DistributionId YOUR_ID`n" -ForegroundColor White
}

Write-Host "📖 See DEPLOY_AWS.md for complete setup guide!`n" -ForegroundColor Cyan
