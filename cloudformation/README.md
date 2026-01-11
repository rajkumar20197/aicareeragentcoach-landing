# AI Career Agent Coach - Re-Deployment Guide

This directory contains the complete CloudFormation patterns for the application. You can redeploy the entire infrastructure whenever you're ready.

## 📁 Infrastructure Components

1.  **`main-app.yaml`**: The core application infrastructure.
    *   S3 Buckets (Uploads, Website)
    *   DynamoDB Tables (Users, Applications, Jobs)
    *   IAM Roles & Lambda Functions
    *   SNS Topics & SQS Queues
2.  **`waitlist-backend.yaml`**: The landing page waitlist system.
    *   Waitlist DynamoDB Table
    *   API Gateway
    *   Waitlist Lambda Handler

## 🚀 How to Deploy

### 1. Pre-requisites
*   Ensure you have the AWS CLI configured.
*   The Lambda code ZIP files should be uploaded to an S3 bucket or provided locally if using the console.

### 2. Deploy Landing Page Waitlist
```bash
aws cloudformation deploy \
  --template-file waitlist-backend.yaml \
  --stack-name aicareer-landing-waitlist \
  --capabilities CAPABILITY_IAM
```

### 3. Deploy Main Application
```bash
aws cloudformation deploy \
  --template-file main-app.yaml \
  --stack-name career-copilot-production \
  --parameter-overrides Environment=production \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

## 🧹 Cleanup Note
All resources have been deleted to stop current costs. The definitions above allow you to restart from scratch with a fresh, clean environment.

---
*Date: 2025-12-30*
