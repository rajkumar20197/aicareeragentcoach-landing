# 🚀 Vercel Deployment Guide

## Quick Deploy (Mobile Data Friendly!)

### Method 1: One-Command Deploy Script

```powershell
# Navigate to coming-soon folder
cd e:\Level_up\AWS_Cloud_Project_Career-Copilot\coming-soon

# Run the deploy script
.\deploy.ps1
```

This script will:
1. ✅ Install dependencies
2. ✅ Install Vercel CLI (if needed)
3. ✅ Login to Vercel
4. ✅ Deploy your site

---

### Method 2: Manual Step-by-Step

```powershell
# 1. Install dependencies
cd coming-soon
npm install

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login
vercel login

# 4. Deploy
vercel

# 5. Deploy to production
vercel --prod
```

---

## 📋 Vercel Prompts & Answers

When you run `vercel`, answer like this:

```
? Set up and deploy "~/coming-soon"? [Y/n] 
→ Y

? Which scope do you want to deploy to? 
→ [Select your account]

? Link to existing project? [y/N] 
→ N

? What's your project's name? 
→ ai-career-agent-coming-soon

? In which directory is your code located? 
→ ./ (just press Enter)

? Want to override the settings? [y/N] 
→ N
```

Vercel will then:
- 🔨 Build your project
- 📤 Upload to Vercel
- ✅ Give you a live URL!

---

## 🌐 Your URLs

After deployment, you'll get:

**Preview URL:** 
`https://ai-career-agent-coming-soon-xxx.vercel.app`

**Production URL (after `vercel --prod`):**
`https://ai-career-agent-coming-soon.vercel.app`

---

## 🎯 Add Custom Domain (When You Have WiFi)

```powershell
# Add your domain
vercel domains add yourdomain.com

# Vercel will show DNS records to add
# Add these to your domain registrar:
# - Type: CNAME
# - Name: @ (or www)
# - Value: cname.vercel-dns.com
```

---

## 🔄 Future Updates

To update your deployed site:

```powershell
# Make changes to code
# Then deploy again:
vercel --prod
```

---

## 💡 Tips for Mobile Data

- ✅ Vercel CLI uses minimal data (just uploads code)
- ✅ Much faster than using browser
- ✅ One-time setup, then super quick deploys
- ✅ ~10MB upload for first deploy (your site is small!)

---

## 🆘 Troubleshooting

### "vercel: command not found"
```powershell
npm install -g vercel
```

### "Not logged in"
```powershell
vercel login
```

### Build fails
```powershell
# Test locally first
npm run build
```

---

## ✅ Success Checklist

- [ ] Navigated to `coming-soon/` folder
- [ ] Ran `npm install`
- [ ] Installed Vercel CLI
- [ ] Logged in to Vercel
- [ ] Deployed with `vercel`
- [ ] Got a live URL
- [ ] Deployed to production with `vercel --prod`
- [ ] Shared the link! 🎉

---

**Ready to deploy? Run the script or follow the steps!** 🚀
