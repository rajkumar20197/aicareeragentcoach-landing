# Certificate Validation Monitor
# Checks SSL certificate status every 30 seconds

$certArn = "arn:aws:acm:us-east-1:980826468182:certificate/e439e8fb-aa38-41a0-a840-cb987e0f35ae"
$region = "us-east-1"

Write-Host "`n=== SSL Certificate Validation Monitor ===" -ForegroundColor Cyan
Write-Host "Monitoring certificate validation..." -ForegroundColor Yellow
Write-Host "This usually takes 5-15 minutes.`n" -ForegroundColor Gray

$startTime = Get-Date
$attempt = 0

while ($true) {
    $attempt++
    $elapsed = [math]::Round(((Get-Date) - $startTime).TotalMinutes, 1)
    
    Write-Host "[$attempt] Checking status (Elapsed: $elapsed min)..." -ForegroundColor Gray
    
    $status = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.Status" --output text 2>&1 | Out-String
    $status = $status.Trim()
    
    if ($status -eq "ISSUED") {
        Write-Host "`n==================================" -ForegroundColor Green
        Write-Host "CERTIFICATE VALIDATED!" -ForegroundColor Green
        Write-Host "==================================`n" -ForegroundColor Green
        Write-Host "Status: $status" -ForegroundColor Green
        Write-Host "Time taken: $elapsed minutes`n" -ForegroundColor White
        Write-Host "NEXT STEP: Run CloudFront deployment" -ForegroundColor Yellow
        Write-Host "Command: .\deploy-cloudfront.ps1`n" -ForegroundColor Cyan
        break
    }
    elseif ($status -eq "PENDING_VALIDATION") {
        Write-Host "   Status: PENDING_VALIDATION (waiting for DNS...)" -ForegroundColor Yellow
    }
    else {
        Write-Host "   Status: $status" -ForegroundColor Red
    }
    
    if ($elapsed -gt 30) {
        Write-Host "`nWARNING: Validation is taking longer than expected." -ForegroundColor Yellow
        Write-Host "This might indicate an issue with the DNS record.`n" -ForegroundColor Yellow
        
        Write-Host "Troubleshooting:" -ForegroundColor Cyan
        Write-Host "1. Verify DNS record in Namecheap Advanced DNS" -ForegroundColor White
        Write-Host "2. Check propagation: nslookup -type=CNAME _229a146ff911be7a5201675ad49a69dd.aicareeragentcoach.agency 8.8.8.8`n" -ForegroundColor White
    }
    
    Write-Host "   Waiting 30 seconds before next check...`n" -ForegroundColor Gray
    Start-Sleep -Seconds 30
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
