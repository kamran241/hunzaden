# 🚀 Deploy Hunza Den to Vercel

## Quick Deployment Guide

### Prerequisites
- ✅ GitHub repository: `https://github.com/kamran241/hunzaden`
- ✅ Vercel account (free): `https://vercel.com`
- ✅ Neon PostgreSQL database URL

---

## 📦 **Step 1: Deploy Backend**

### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to Vercel Dashboard**
   - Visit: `https://vercel.com/dashboard`
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select "Import Git Repository"
   - Choose: `kamran241/hunzaden`
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name:** `hunzaden-backend`
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - Click "Edit" next to Root Directory
   - Select `backend` folder

4. **Environment Variables**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_cTevnLMH6jC8@ep-ancient-unit-ahceoki9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   PORT = 5000
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)
   - Copy your backend URL (e.g., `https://hunzaden-backend.vercel.app`)

### **Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend
cd backend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name? hunzaden-backend
# - Directory? ./
# - Override settings? N

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

---

## 🎨 **Step 2: Update Frontend API URL**

After backend is deployed, update the frontend to use the production API:

### **Create Environment File**

**File:** `frontend/.env.production`
```env
VITE_API_URL=https://hunzaden-backend.vercel.app/api
```

**File:** `frontend/.env.development`
```env
VITE_API_URL=http://localhost:5000/api
```

### **Update Components**

Update these files to use environment variable:

**1. ReviewForm.jsx**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**2. ViewReviews.jsx**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**3. EditReviewSelector.jsx**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🌐 **Step 3: Deploy Frontend**

### **Via Vercel Dashboard**

1. **Add New Project**
   - Go to Vercel Dashboard
   - Click "Add New" → "Project"
   - Import same repository: `kamran241/hunzaden`

2. **Configure Frontend Project**
   - **Project Name:** `hunzaden-frontend`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - Click "Edit" and select `frontend` folder

3. **Environment Variables**
   ```
   VITE_API_URL = https://hunzaden-backend.vercel.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at: `https://hunzaden-frontend.vercel.app`

### **Via Vercel CLI**

```bash
# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts
# Then deploy to production
vercel --prod
```

---

## ✅ **Step 4: Test Your Deployment**

1. **Visit Your App**
   ```
   https://hunzaden-frontend.vercel.app
   ```

2. **Enter Password**
   ```
   hunzaden
   ```

3. **Test Features**
   - ✅ Create a review
   - ✅ View reviews
   - ✅ Edit a review
   - ✅ Delete a review

---

## 🔧 **Troubleshooting**

### **Backend Issues**

**Problem:** Database connection fails
- **Solution:** Check DATABASE_URL in Vercel environment variables
- Ensure Neon database is accessible
- Check SSL mode is set to `require`

**Problem:** API returns 404
- **Solution:** Verify vercel.json is in backend folder
- Check routes are defined correctly

### **Frontend Issues**

**Problem:** Can't connect to backend
- **Solution:** Verify VITE_API_URL is set correctly
- Check CORS is enabled in backend
- Ensure backend is deployed and running

**Problem:** Environment variables not working
- **Solution:** Rebuild frontend after adding env vars
- Ensure variables start with `VITE_`

---

## 📝 **Important URLs**

After deployment, save these URLs:

```
Backend API: https://hunzaden-backend.vercel.app
Frontend App: https://hunzaden-frontend.vercel.app
GitHub Repo: https://github.com/kamran241/hunzaden
Neon Database: [Your Neon dashboard]
```

---

## 🔄 **Updating Your App**

To update your deployed app:

1. **Make changes locally**
2. **Commit to GitHub**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. **Vercel auto-deploys** from GitHub (if connected)

Or manually redeploy:
```bash
vercel --prod
```

---

## 🎯 **Custom Domain (Optional)**

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain
5. Follow DNS configuration instructions

---

## 🔐 **Security Checklist**

- ✅ `.env` file is in `.gitignore`
- ✅ Database credentials are in Vercel environment variables
- ✅ SSL is enabled for database connection
- ✅ CORS is configured properly
- ✅ Password protection is enabled

---

## 📊 **Monitoring**

- **Vercel Dashboard:** Monitor deployments, errors, and analytics
- **Neon Dashboard:** Monitor database usage and performance
- **GitHub:** Track code changes and issues

---

**Your Hunza Den review system is ready for production!** 🎉
