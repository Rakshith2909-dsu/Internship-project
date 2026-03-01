# 🚀 Deployment Guide - Mindful Wave Website

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```
   Follow the prompts and your site will be live in minutes!

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/Login with your GitHub account

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select your repository: `Rakshith2909-dsu/Internship-project`
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add these:
   ```
   VITE_SUPABASE_PROJECT_ID=zwbssoeedanalavmdvmu
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YnNzb2VlZGFuYWxhdm1kdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDE4NTAsImV4cCI6MjA4NjkxNzg1MH0.bWQp5yr1mw3MXD4flobUsyawyzHKSb4jYATvTH35UlI
   VITE_SUPABASE_URL=https://zwbssoeedanalavmdvmu.supabase.co
   VITE_RAZORPAY_KEY_ID=rzp_test_SKMmK5Nvh70l64
   VITE_RESEND_API_KEY=re_N8JFPM8A_6dJ5Rz1DeY4mTLPpfjh1w2n6
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - Your site is live! 🎉

## 🌐 Custom Domain Setup

### Free Vercel Domain
You'll automatically get: `your-project-name.vercel.app`

### Custom Domain (Recommended Options)

#### **1. Free Domain from Vercel**
- Vercel provides: `mindful-wave.vercel.app` (or similar)
- Professional and instant setup

#### **2. Purchase Custom Domain**

**Recommended Registrars:**
- **Namecheap** (~$10/year): [namecheap.com](https://www.namecheap.com)
  - Suggested: `mindful-wave.com`, `mindfulwave.co`, `mindfulwave.org`
- **Google Domains** (~$12/year): [domains.google](https://domains.google)
- **Cloudflare** (~$10/year): [cloudflare.com](https://www.cloudflare.com/products/registrar/)

**Good Domain Names Ideas:**
- `mindful-wave.com`
- `mindfulwave.wellness`
- `mindfulwave.co`
- `themindfulwave.com`
- `mindfulwave.in` (for India)

#### **3. Connect Custom Domain to Vercel**

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `mindful-wave.com`)
3. Vercel will provide DNS records
4. Add these records in your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait 5-60 minutes for DNS propagation
6. SSL certificate is automatically provisioned

## 📱 Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Build settings are auto-detected
4. Add environment variables
5. Deploy

### AWS Amplify
1. Go to AWS Amplify Console
2. Connect repository
3. Configure build settings
4. Deploy

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## ✅ Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages accessible (routing works)
- [ ] Supabase connection working (test login/signup)
- [ ] Razorpay payments working (test booking)
- [ ] Email notifications working
- [ ] Mobile responsive design
- [ ] SSL certificate active (https://)
- [ ] Custom domain configured
- [ ] Environment variables set
- [ ] Admin dashboard accessible

## 🔧 Troubleshooting

### Build Fails
- Check all dependencies are installed
- Verify environment variables are set correctly
- Run `npm run build` locally to test

### Routing Issues (404 on refresh)
- Ensure `vercel.json` has proper rewrites (already configured)

### API/Supabase Not Working
- Verify environment variables in Vercel dashboard
- Check Supabase project is active
- Update Supabase allowed origins to include your domain

### Payment Issues
- Update Razorpay dashboard with your production domain
- Switch to live keys for production

## 🎉 Your Website Is Live!

Once deployed, your Mindful Wave wellness website will be accessible 24/7 with:
- ✅ Global CDN (fast loading worldwide)
- ✅ Automatic HTTPS/SSL
- ✅ Automatic deployments on git push
- ✅ Professional domain
- ✅ 99.99% uptime

**Next Steps:**
1. Test all features thoroughly
2. Share your website link
3. Monitor using Vercel Analytics
4. Set up custom email forwarding for your domain
