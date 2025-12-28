# Email Notifications Setup Script
# Configures AWS SES and updates Lambda with email capabilities

param(
    [Parameter(Mandatory = $true)]
    [string]$AdminEmail,
    
    [Parameter(Mandatory = $true)]
    [string]$FromEmail,
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1"
)

Write-Host "`n== Email Notifications Setup ==" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Admin Email: $AdminEmail" -ForegroundColor White
Write-Host "  From Email: $FromEmail" -ForegroundColor White
Write-Host "  Region: $Region`n" -ForegroundColor White

# Step 1: Verify email addresses in SES
Write-Host "Step 1: Verifying email addresses in SES..." -ForegroundColor Yellow

Write-Host "   Verifying admin email: $AdminEmail" -ForegroundColor Gray
aws ses verify-email-identity --email-address $AdminEmail --region $Region 2>&1 | Out-Null

Write-Host "   Verifying from email: $FromEmail" -ForegroundColor Gray  
aws ses verify-email-identity --email-address $FromEmail --region $Region 2>&1 | Out-Null

Write-Host "SUCCESS: Verification emails sent!`n" -ForegroundColor Green

Write-Host "IMPORTANT: Check your inbox for verification emails!" -ForegroundColor Yellow
Write-Host "  1. Check $AdminEmail" -ForegroundColor White
Write-Host "  2. Check $FromEmail" -ForegroundColor White
Write-Host "  3. Click the verification links in both emails`n" -ForegroundColor White

# Wait for user confirmation
Write-Host "Waiting for email verification..." -ForegroundColor Yellow
Write-Host "Press ENTER after you've clicked BOTH verification links..." -ForegroundColor Cyan
Read-Host

# Step 2: Update Lambda dependencies
Write-Host "`nStep 2: Installing Lambda dependencies..." -ForegroundColor Yellow
Push-Location infrastructure

if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}

npm install --omit=dev --silent

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host "SUCCESS: Dependencies installed`n" -ForegroundColor Green

# Step 3: Package Lambda function
Write-Host "Step 3: Packaging Lambda function..." -ForegroundColor Yellow
Push-Location infrastructure

if (Test-Path "waitlist-function.zip") {
    Remove-Item "waitlist-function.zip" -Force
}

Compress-Archive -Path waitlist-handler.js, package.json, node_modules -DestinationPath waitlist-function.zip -CompressionLevel Fastest -Force
Pop-Location
Write-Host "SUCCESS: Lambda packaged`n" -ForegroundColor Green

# Step 4: Update Lambda function code
Write-Host "Step 4: Updating Lambda function code..." -ForegroundColor Yellow

$functionName = "aicareer-waitlist-handler"

aws lambda update-function-code `
    --function-name $functionName `
    --zip-file fileb://infrastructure/waitlist-function.zip `
    --region $Region 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Lambda code update failed!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3
Write-Host "SUCCESS: Lambda code updated`n" -ForegroundColor Green

# Step 5: Update Lambda environment variables
Write-Host "Step 5: Configuring environment variables..." -ForegroundColor Yellow

$envVars = @{
    Variables = @{
        TABLE_NAME  = "aicareer-landing-waitlist"
        CORS_ORIGIN = "*"
        ADMIN_EMAIL = $AdminEmail
        FROM_EMAIL  = $FromEmail
    }
} | ConvertTo-Json -Compress

aws lambda update-function-configuration `
    --function-name $functionName `
    --environment $envVars `
    --region $Region 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Environment variable update failed!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Environment configured`n" -ForegroundColor Green

# Step 6: Update IAM role for SES permissions
Write-Host "Step 6: Updating IAM permissions for SES..." -ForegroundColor Yellow

$sesPolicy = @{
    Version   = "2012-10-17"
    Statement = @(
        @{
            Effect   = "Allow"
            Action   = @(
                "ses:SendEmail",
                "ses:SendRawEmail"
            )
            Resource = "*"
        }
    )
} | ConvertTo-Json -Depth 10

$sesPolicy | Out-File -FilePath "ses-policy.json" -Encoding UTF8

aws iam put-role-policy `
    --role-name aicareer-waitlist-lambda-role `
    --policy-name SESEmailPolicy `
    --policy-document file://ses-policy.json 2>&1 | Out-Null

Remove-Item "ses-policy.json" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Could not update IAM policy automatically" -ForegroundColor Yellow
    Write-Host "   You may need to add SES permissions manually`n" -ForegroundColor Gray
}
else {
    Write-Host "SUCCESS: IAM permissions updated`n" -ForegroundColor Green
}

# Cleanup
Remove-Item infrastructure/waitlist-function.zip -ErrorAction SilentlyContinue

# Success!
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "== SETUP COMPLETE! ==" -ForegroundColor Green
Write-Host "==============================`n" -ForegroundColor Cyan

Write-Host "Email Notifications Configured:" -ForegroundColor Cyan
Write-Host "  Admin notifications: $AdminEmail" -ForegroundColor Green
Write-Host "  User confirmations from: $FromEmail`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Test the waitlist form on your live site" -ForegroundColor White
Write-Host "  2. Check $AdminEmail for admin notification" -ForegroundColor White
Write-Host "  3. Check test email for user confirmation`n" -ForegroundColor White

Write-Host "NOTE: SES is in sandbox mode by default." -ForegroundColor Gray
Write-Host "You can only send to verified email addresses." -ForegroundColor Gray
Write-Host "To send to anyone, request production access in AWS Console.`n" -ForegroundColor Gray
