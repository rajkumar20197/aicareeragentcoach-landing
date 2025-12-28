# AI Career Agent Coach - Waitlist Backend Deployment Script (Fixed)
# Deploys Lambda, DynamoDB, and API Gateway for waitlist

param(
    [Parameter(Mandatory = $false)]
    [string]$StackName = "aicareer-landing-waitlist",
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1"
)

Write-Host "`n== Waitlist Backend Deployment ==" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Step 1: Install Lambda dependencies
Write-Host "Step 1: Installing Lambda dependencies..." -ForegroundColor Yellow
Push-Location infrastructure
if (Test-Path "node_modules") {
    Write-Host "   Dependencies already installed" -ForegroundColor Gray
}
else {
    npm install --omit=dev --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location
Write-Host "SUCCESS: Dependencies ready`n" -ForegroundColor Green

# Step 2: Package Lambda function
Write-Host "Step 2: Packaging Lambda function..." -ForegroundColor Yellow
Push-Location infrastructure

# Remove old package if exists
if (Test-Path "waitlist-function.zip") {
    Remove-Item "waitlist-function.zip" -Force
}

# Create zip file
Compress-Archive -Path waitlist-handler.js, package.json, node_modules -DestinationPath waitlist-function.zip -CompressionLevel Fastest -Force
Write-Host "SUCCESS: Lambda packaged`n" -ForegroundColor Green
Pop-Location

# Step 3: Deploy CloudFormation stack
Write-Host "Step 3: Deploying CloudFormation stack..." -ForegroundColor Yellow

Write-Host "   Deploying stack (this may take 2-3 minutes)..." -ForegroundColor Gray

aws cloudformation deploy `
    --template-file infrastructure/cloudformation-waitlist.yaml `
    --stack-name $StackName `
    --region $Region `
    --capabilities CAPABILITY_NAMED_IAM `
    --no-fail-on-empty-changeset 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: CloudFormation deployment failed!" -ForegroundColor Red
    Write-Host "   Check AWS Console for stack events" -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS: Stack deployed`n" -ForegroundColor Green

# Step 4: Update Lambda function code
Write-Host "Step 4: Updating Lambda function code..." -ForegroundColor Yellow

$functionName = "aicareer-waitlist-handler"

aws lambda update-function-code `
    --function-name $functionName `
    --zip-file fileb://infrastructure/waitlist-function.zip `
    --region $Region 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Lambda update failed!" -ForegroundColor Red
    exit 1
}

# Wait for function to be active
Write-Host "   Waiting for function to be ready..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "SUCCESS: Lambda code updated`n" -ForegroundColor Green

# Step 5: Get API endpoint
Write-Host "Step 5: Retrieving API endpoint..." -ForegroundColor Yellow

$outputs = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query "Stacks[0].Outputs" `
    --output json | ConvertFrom-Json

$apiEndpoint = ($outputs | Where-Object { $_.OutputKey -eq "ApiEndpoint" }).OutputValue

if (-not $apiEndpoint) {
    Write-Host "ERROR: Could not retrieve API endpoint!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: API endpoint retrieved`n" -ForegroundColor Green

# Step 6: Test the endpoint
Write-Host "Step 6: Testing API endpoint..." -ForegroundColor Yellow

$testEmail = "test-$(Get-Random)@example.com"
$testBody = @{
    email = $testEmail
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiEndpoint -Method POST -Body $testBody -ContentType "application/json"
    if ($response.success) {
        Write-Host "SUCCESS: API is working! Test email stored: $testEmail`n" -ForegroundColor Green
    }
    else {
        Write-Host "WARNING: API responded but with error: $($response.error)`n" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "WARNING: Could not test endpoint automatically" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   You can test manually after deployment`n" -ForegroundColor Gray
}

# Cleanup
Remove-Item infrastructure/waitlist-function.zip -ErrorAction SilentlyContinue

# Success!
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "== DEPLOYMENT COMPLETE! ==" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Resources Created:" -ForegroundColor Cyan
Write-Host "  DynamoDB Table: aicareer-landing-waitlist" -ForegroundColor White
Write-Host "  Lambda Function: $functionName" -ForegroundColor White
Write-Host "  API Gateway: aicareer-landing-waitlist-api`n" -ForegroundColor White

Write-Host "API Endpoint (IMPORTANT - SAVE THIS):" -ForegroundColor Yellow
Write-Host "  $apiEndpoint`n" -ForegroundColor Green

# Save endpoint to file for easy reference
$apiEndpoint | Out-File -FilePath "infrastructure/API_ENDPOINT.txt" -Encoding UTF8 -NoNewline
Write-Host "API endpoint saved to: infrastructure\API_ENDPOINT.txt`n" -ForegroundColor Gray

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. I'll now update the WaitlistForm.tsx automatically" -ForegroundColor White
Write-Host "  2. Then redeploy your frontend`n" -ForegroundColor White

# Return the endpoint for use in next steps
return $apiEndpoint
