# 📧 Email Notifications - Quick Setup Guide

## What You'll Get:

1. **Confirmation Email to Users**
   - Beautiful HTML email
   - Sends automatically when someone joins
   - Confirms their founding member status

2. **Notification to You (Admin)**
   - Get notified immediately when someone joins
   - Includes email, timestamp, and IP address
   - Direct link to view in DynamoDB

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Choose Your Emails

You need TWO email addresses:

1. **Admin Email** (where YOU receive notifications)
   - Your personal email
   - Example: `your.email@gmail.com`

2. **From Email** (what users see as sender)
   - Can be the same as admin email
   - Or use a professional one like `hello@aicareeragentcoach.agency`
   - Example: `noreply@aicareeragentcoach.agency`

### Step 2: Run the Setup Script

```powershell
.\infrastructure\setup-email-notifications.ps1 -AdminEmail "your.email@gmail.com" -FromEmail "noreply@aicareeragentcoach.agency"
```

### Step 3: Verify Emails

AWS will send verification emails to BOTH addresses:
1. Check your inbox (may be in spam)
2. Click the verification links
3. Wait for "Email verified" confirmation

### Step 4: Test It!

Visit your landing page and submit a test email:
- http://aicareeragentcoach.agency.s3-website-us-east-1.amazonaws.com

You should receive:
- ✅ Confirmation email (if you submit your own email)
- ✅ Admin notification (to your admin email)

---

## 📋 Email Templates

### User Confirmation Email:
```
Subject: 🎉 Welcome to AI Career Agent Coach - You're on the List!

- Beautiful branded HTML email
- Founding member badge
- Next steps information
- Professional footer
```

### Admin Notification:
```
Subject: 🔔 New Waitlist Signup: user@example.com

- Email address
- Timestamp
- IP address
- Direct link to DynamoDB
```

---

## ⚠️ Important: SES Sandbox Mode

By default, AWS SES is in **sandbox mode**:
- ✅ Can send to verified email addresses only
- ❌ Cannot send to random users

**To send to anyone**:
1. Go to AWS Console → SES
2. Request production access
3. Usually approved in 24 hours

**For now (sandbox mode)**:
- Users will join the waitlist (stored in DynamoDB)
- Only verified emails receive confirmation
- You'll still get admin notifications
- Perfect for testing!

---

## 🎯 What Emails to Use?

### Option 1: Use Your Personal Email for Both
```powershell
.\infrastructure\setup-email-notifications.ps1 -AdminEmail "you@gmail.com" -FromEmail "you@gmail.com"
```

**Pros**: Simple, works immediately
**Cons**: Users see your personal email

### Option 2: Use Professional From Email
```powershell
.\infrastructure\setup-email-notifications.ps1 -AdminEmail "you@gmail.com" -FromEmail "hello@aicareeragentcoach.agency"
```

**Pros**: Professional appearance
**Cons**: Need to verify domain email (may need email hosting)

### Option 3: Use Gmail for From Email
```powershell
.\infrastructure\setup-email-notifications.ps1 -AdminEmail "you@gmail.com" -FromEmail "aicareeragentcoach@gmail.com"
```

**Pros**: Professional + easy to set up
**Cons**: Need to create the Gmail account first

---

## 💡 My Recommendation

**For testing now:**
```powershell
.\infrastructure\setup-email-notifications.ps1 -AdminEmail "YOUR_EMAIL" -FromEmail "YOUR_EMAIL"
```

**For production later:**
- Set up professional domain email
- Request SES production access
- Re-run script with new emails

---

## 🚀 Ready to Set Up?

Just tell me:
1. Your admin email (where you want notifications)
2. Your from email (what users will see)

Or if you want to use the same email for both, just give me one email address!

---

**Example:**
```
Admin Email: rajkumar@example.com
From Email: rajkumar@example.com
```

Then I'll run the setup script for you! 📧
