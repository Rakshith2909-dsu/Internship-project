# 🚀 GitHub Pages Deployment - Quick Setup

Your website is configured for automatic deployment to GitHub Pages!

## 📋 Setup Steps (One-Time Only)

### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/Rakshith2909-dsu/Internship-project
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. That's it!

### Step 2: Add Environment Variables (Secrets)
1. Still in Settings, click **Secrets and variables** → **Actions** (left sidebar)
2. Click **New repository secret** for each of these:

```
VITE_SUPABASE_PROJECT_ID
Value: zwbssoeedanalavmdvmu

VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YnNzb2VlZGFuYWxhdm1kdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDE4NTAsImV4cCI6MjA4NjkxNzg1MH0.bWQp5yr1mw3MXD4flobUsyawyzHKSb4jYATvTH35UlI

VITE_SUPABASE_URL
Value: https://zwbssoeedanalavmdvmu.supabase.co

VITE_RAZORPAY_KEY_ID
Value: rzp_test_SKMmK5Nvh70l64

VITE_RESEND_API_KEY
Value: re_N8JFPM8A_6dJ5Rz1DeY4mTLPpfjh1w2n6
```

### Step 3: Trigger Deployment
After pushing the changes (already done), the deployment will start automatically!

## 🌐 Your Website URL

Once deployed, your website will be live at:
**https://rakshith2909-dsu.github.io/Internship-project/**

## 🎯 How It Works

- Every time you push to the `main` branch, GitHub Actions automatically:
  1. Builds your website
  2. Deploys it to GitHub Pages
  3. Updates your live site

## ⏱️ Deployment Time

- First deployment: 2-5 minutes
- Subsequent deployments: 1-3 minutes

## 📊 Check Deployment Status

1. Go to your repository
2. Click **Actions** tab (top menu)
3. You'll see the deployment progress
4. Green checkmark ✓ means it's live!

## 🔧 Custom Domain (Optional)

Want a custom domain like `mindful-wave.com`?

1. Buy domain from Namecheap, GoDaddy, or Google Domains (~$10/year)
2. In GitHub repo Settings → Pages → Custom domain
3. Enter your domain and click Save
4. Add these DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: rakshith2909-dsu.github.io
   ```
5. Wait 24 hours for DNS propagation

## ✅ What's Already Done

- ✓ GitHub Actions workflow configured
- ✓ Vite build settings optimized for GitHub Pages
- ✓ Repository routing configured
- ✓ Production build tested

## 🆘 Troubleshooting

### Deployment Failed?
- Check Actions tab for error details
- Ensure all secrets are added correctly
- Verify Pages is enabled in Settings

### Website Shows 404?
- Wait 5 minutes after first deployment
- Clear browser cache (Ctrl+F5)
- Check that Pages source is set to "GitHub Actions"

### Supabase/API Not Working?
- Verify all 5 secrets are added in repository settings
- Check Supabase allowed origins includes your GitHub Pages URL

## 🎉 That's It!

Your website is now deployed and will automatically update whenever you push changes to GitHub!

**Your Live Website:** https://rakshith2909-dsu.github.io/Internship-project/
