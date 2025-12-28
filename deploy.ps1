# 🚀 Quick Deploy to Vercel Script
# Run this from PowerShell in the coming-soon directory

Write-Host "`n🚀 AI Career Agent Coach - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this from the coming-soon directory" -ForegroundColor Red
    Write-Host "   Run: cd e:\Level_up\AWS_Cloud_Project_Career-Copilot\coming-soon`n" -ForegroundColor Yellow
    exit
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit
}

Write-Host "`n✅ Dependencies installed!" -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "`n📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit
    }
    
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
}

Write-Host "`n🔑 Step 2: Login to Vercel" -ForegroundColor Yellow
Write-Host "   (This will open your browser)`n" -ForegroundColor Gray

vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed" -ForegroundColor Red
    exit
}

Write-Host "`n✅ Logged in successfully!" -ForegroundColor Green

Write-Host "`n🚀 Step 3: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "   Answer the prompts (see guide above)`n" -ForegroundColor Gray

vercel

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "`nYour site is live! Check the URL above ☝️`n" -ForegroundColor Cyan
    
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. To deploy to production: vercel --prod" -ForegroundColor White
    Write-Host "   2. To add custom domain: vercel domains add yourdomain.com`n" -ForegroundColor White
}
else {
    Write-Host "`n❌ Deployment failed. Check errors above." -ForegroundColor Red
}
