# CloudFront Distribution Deployment Script
# Run AFTER SSL certificate is validated

param(
    [Parameter(Mandatory = $false)]
    [string]$CertificateArn = "arn:aws:acm:us-east-1:980826468182:certificate/e439e8fb-aa38-41a0-a840-cb987e0f35ae",
    
    [Parameter(Mandatory = $false)]
    [string]$BucketName = "aicareeragentcoach.agency",
    
    [Parameter(Mandatory = $false)]
    [string]$Domain = "aicareeragentcoach.agency",
    
    [Parameter(Mandatory = $false)]
    [string]$Region = "us-east-1"
)

Write-Host "`n== CloudFront Distribution Setup ==" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Step 1: Verify certificate is validated
Write-Host "Step 1: Checking SSL certificate status..." -ForegroundColor Yellow

$certStatus = aws acm describe-certificate --certificate-arn $CertificateArn --region $Region --query "Certificate.Status" --output text 2>&1

if ($certStatus -ne "ISSUED") {
    Write-Host "ERROR: Certificate is not yet validated!" -ForegroundColor Red
    Write-Host "   Current status: $certStatus" -ForegroundColor Yellow
    Write-Host "   Please add the DNS validation record and wait for validation." -ForegroundColor Yellow
    Write-Host "   See SSL_SETUP_INSTRUCTIONS.md for details.`n" -ForegroundColor Gray
    exit 1
}

Write-Host "SUCCESS: Certificate is validated!`n" -ForegroundColor Green

# Step 2: Create CloudFront distribution config
Write-Host "Step 2: Creating CloudFront distribution..." -ForegroundColor Yellow

$distributionConfig = @{
    CallerReference      = "aicareer-landing-$(Get-Date -Format 'yyyyMMddHHmmss')"
    Comment              = "AI Career Agent Coach - Coming Soon Page"
    Enabled              = $true
    DefaultRootObject    = "index.html"
    Aliases              = @{
        Quantity = 2
        Items    = @($Domain, "www.$Domain")
    }
    Origins              = @{
        Quantity = 1
        Items    = @(
            @{
                Id                 = "S3-$BucketName"
                DomainName         = "$BucketName.s3-website-$Region.amazonaws.com"
                CustomOriginConfig = @{
                    HTTPPort             = 80
                    HTTPSPort            = 443
                    OriginProtocolPolicy = "http-only"
                    OriginSslProtocols   = @{
                        Quantity = 1
                        Items    = @("TLSv1.2")
                    }
                }
            }
        )
    }
    DefaultCacheBehavior = @{
        TargetOriginId       = "S3-$BucketName"
        ViewerProtocolPolicy = "redirect-to-https"
        AllowedMethods       = @{
            Quantity      = 2
            Items         = @("GET", "HEAD")
            CachedMethods = @{
                Quantity = 2
                Items    = @("GET", "HEAD")
            }
        }
        Compress             = $true
        MinTTL               = 0
        DefaultTTL           = 86400
        MaxTTL               = 31536000
        ForwardedValues      = @{
            QueryString = $false
            Cookies     = @{
                Forward = "none"
            }
            Headers     = @{
                Quantity = 0
            }
        }
        TrustedSigners       = @{
            Enabled  = $false
            Quantity = 0
        }
    }
    ViewerCertificate    = @{
        ACMCertificateArn      = $CertificateArn
        SSLSupportMethod       = "sni-only"
        MinimumProtocolVersion = "TLSv1.2_2021"
        Certificate            = $CertificateArn
        CertificateSource      = "acm"
    }
    CustomErrorResponses = @{
        Quantity = 1
        Items    = @(
            @{
                ErrorCode          = 404
                ResponsePagePath   = "/index.html"
                ResponseCode       = "200"
                ErrorCachingMinTTL = 300
            }
        )
    }
    PriceClass           = "PriceClass_100"
}

# Save config to file
$distributionConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath "cloudfront-config.json" -Encoding UTF8

# Create distribution
Write-Host "   Creating distribution (this takes 5-10 minutes)..." -ForegroundColor Gray

try {
    $result = aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --output json | ConvertFrom-Json
    
    $distributionId = $result.Distribution.Id
    $cloudfrontDomain = $result.Distribution.DomainName
    
    Write-Host "SUCCESS: CloudFront distribution created!`n" -ForegroundColor Green
    
    # Save distribution info
    @{
        DistributionId   = $distributionId
        CloudFrontDomain = $cloudfrontDomain
        Status           = "Deploying"
    } | ConvertTo-Json | Out-File -FilePath "cloudfront-info.json" -Encoding UTF8
    
    # Clean up
    Remove-Item "cloudfront-config.json" -ErrorAction SilentlyContinue
    
    # Display results
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "== CLOUDFRONT DEPLOYED! ==" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Distribution Details:" -ForegroundColor Cyan
    Write-Host "  ID: $distributionId" -ForegroundColor White
    Write-Host "  Domain: $cloudfrontDomain" -ForegroundColor White
    Write-Host "  Status: Deploying (5-10 min to complete)`n" -ForegroundColor Yellow
    
    Write-Host "NEXT STEP - Add these DNS records at your registrar:" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Record 1 (Root domain):" -ForegroundColor Cyan
    Write-Host "  Type: CNAME" -ForegroundColor White
    Write-Host "  Name: @ or $Domain" -ForegroundColor White
    Write-Host "  Value: $cloudfrontDomain" -ForegroundColor Green
    Write-Host "  TTL: 300`n" -ForegroundColor White
    
    Write-Host "Record 2 (WWW subdomain):" -ForegroundColor Cyan
    Write-Host "  Type: CNAME" -ForegroundColor White
    Write-Host "  Name: www" -ForegroundColor White
    Write-Host "  Value: $cloudfrontDomain" -ForegroundColor Green
    Write-Host "  TTL: 300`n" -ForegroundColor White
    
    Write-Host "After adding DNS records, your site will be live at:" -ForegroundColor Yellow
    Write-Host "  https://$Domain" -ForegroundColor Green
    Write-Host "  https://www.$Domain`n" -ForegroundColor Green
    
    Write-Host "Wait 10-15 minutes for:" -ForegroundColor Gray
    Write-Host "  - CloudFront distribution to deploy" -ForegroundColor Gray
    Write-Host "  - DNS records to propagate`n" -ForegroundColor Gray
    
    # Save DNS instructions
    $dnsInstructions = @"
DNS Records for $Domain
========================================

Add these CNAME records at your domain registrar:

Record 1:
  Type: CNAME
  Name: @ (or $Domain)
  Value: $cloudfrontDomain
  TTL: 300

Record 2:
  Type: CNAME  
  Name: www
  Value: $cloudfrontDomain
  TTL: 300

Note: Some registrars don't allow CNAME on root (@).
If that's the case, use ALIAS or ANAME if available,
or only set up the www subdomain.

After DNS propagation (10-30 min), test:
  https://$Domain
  https://www.$Domain
"@
    
    $dnsInstructions | Out-File -FilePath "DNS_RECORDS_NEEDED.txt" -Encoding UTF8
    Write-Host "DNS instructions saved to: DNS_RECORDS_NEEDED.txt`n" -ForegroundColor Gray
    
    Write-Host "Distribution ID saved for future deployments!" -ForegroundColor Green
    Write-Host "Update your site with: .\deploy-aws.ps1 -DistributionId $distributionId`n" -ForegroundColor Gray
    
}
catch {
    Write-Host "ERROR: Failed to create CloudFront distribution!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)`n" -ForegroundColor Yellow
    Remove-Item "cloudfront-config.json" -ErrorAction SilentlyContinue
    exit 1
}
