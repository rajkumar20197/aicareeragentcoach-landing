# AI Career Agent Coach - Coming Soon Page

Landing page for **aicareeragentcoach.agency**

## 🎯 Live Site

### ✅ Production URL (LIVE NOW!)
**🔗 https://aicareeragentcoach.agency/**

### Alternative Access
- **S3 Endpoint:** http://aicareeragentcoach.agency.s3-website-us-east-1.amazonaws.com
- **WWW:** https://www.aicareeragentcoach.agency

> 📝 See `LIVE_DEPLOYMENT_INFO.md` for complete deployment details

## 🚀 Quick Deploy to AWS

```powershell
# Build and deploy in one command
.\deploy-aws.ps1

# Or with CloudFront invalidation
.\deploy-aws.ps1 -DistributionId YOUR_CLOUDFRONT_ID
```

See `DEPLOY_AWS.md` for complete setup guide.

## 🛠️ Local Development

```powershell
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 📦 Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Hosting:** AWS S3 + CloudFront
- **SSL:** AWS ACM (free)
- **Domain:** aicareeragentcoach.agency

## 🎨 Features

- ✅ Cinematic dark theme
- ✅ Live countdown timer (30 days)
- ✅ Email waitlist form
- ✅ Blurred feature teasers
- ✅ Smooth animations
- ✅ Fully responsive
- ✅ SEO optimized
- ✅ Circuit brain logo

## 📁 Project Structure

```
coming-soon/
├── public/
│   └── images/         # Logo and assets
├── src/
│   ├── components/     # React components
│   ├── App.tsx         # Main app component
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── dist/               # Production build (generated)
├── deploy-aws.ps1      # AWS deployment script
├── DEPLOY_AWS.md       # Complete deployment guide
└── package.json        # Dependencies
```

## 🔗 Backend Integration

The waitlist form can be connected to AWS Lambda. See:
- `../lambda/waitlist-handler/` for Lambda function
- Instructions in the main project README

## 💰 AWS Hosting Costs

~$0.50 - $1.00/month
- S3 storage: ~$0.023/GB
- CloudFront: ~$0.085/GB transferred
- Route 53: $0.50/month
- ACM Certificate: FREE

## 📝 Environment

- **Domain:** aicareeragentcoach.agency
- **AWS Region:** us-east-1
- **S3 Bucket:** aicareeragentcoach.agency
- **CloudFront:** Enabled with SSL

## 🎉 Deployment Status

- [x] React app built
- [x] Logo integrated
- [x] Local testing complete
- [ ] S3 bucket created
- [ ] CloudFront configured
- [ ] SSL certificate issued
- [ ] DNS configured
- [ ] Site live

---

## 📄 License & Copyright

**Copyright © 2025 Raj Kumar & Team**  
All rights reserved.

This is a personal project for **AI Career Agent Coach**. The code and design are proprietary and intended for this specific application.

---

**Built with ❤️ for ambitious career seekers**
