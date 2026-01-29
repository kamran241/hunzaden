# 🔗 Connect Frontend to Backend

## Your Deployment URLs

- **Frontend:** https://hunzaden-3diu.vercel.app
- **Backend:** [Your backend URL here]

---

## ⚠️ **IMPORTANT: Update Backend URL**

You need to replace `https://hunzaden-backend.vercel.app` with your **actual backend URL**.

### **Find Your Backend URL:**

1. Go to https://vercel.com/dashboard
2. Find your backend project
3. Copy the deployment URL (e.g., `https://hunzaden-api-xyz.vercel.app`)

---

## **Method 1: Via Vercel Dashboard (Fastest)**

1. **Go to Frontend Project:**
   - https://vercel.com/dashboard
   - Click on `hunzaden-3diu` (your frontend)

2. **Settings → Environment Variables:**
   - Click "Add New"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://YOUR-BACKEND-URL.vercel.app/api`
   - **Environment:** Production
   - Save

3. **Redeploy:**
   - Deployments tab → Click ⋯ → Redeploy

---

## **Method 2: Via Code (If you prefer)**

1. **Update `.env.production`:**
   ```env
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.vercel.app/api
   ```

2. **Commit and Push:**
   ```bash
   git add frontend/.env.production
   git commit -m "Update: Add production backend URL"
   git push
   ```

3. **Vercel will auto-deploy**

---

## **How to Find Your Backend URL**

### **Option A: Check Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Look for your backend project
3. Click on it
4. Copy the URL at the top

### **Option B: Check Your Deployments**
1. Look for the project you deployed with `backend` root directory
2. The URL will be something like:
   - `https://hunzaden-backend.vercel.app`
   - `https://hunzaden-api.vercel.app`
   - `https://your-project-name.vercel.app`

---

## **Test Your Connection**

After updating the environment variable:

1. **Visit your frontend:**
   ```
   https://hunzaden-3diu.vercel.app
   ```

2. **Enter password:**
   ```
   hunzaden
   ```

3. **Try to submit a review**
   - If it works → ✅ Connected!
   - If it fails → Check browser console for errors

---

## **Troubleshooting**

### **Error: Failed to fetch**
- ✅ Check backend URL is correct
- ✅ Ensure backend is deployed and running
- ✅ Check CORS is enabled in backend (it is)

### **Error: 404 Not Found**
- ✅ Make sure URL ends with `/api`
- ✅ Example: `https://backend-url.vercel.app/api`

### **Error: Network Error**
- ✅ Backend might not be deployed yet
- ✅ Check backend deployment status

---

## **Quick Fix Command**

If you know your backend URL, run this:

```bash
# Replace YOUR-BACKEND-URL with actual URL
echo "VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api" > frontend/.env.production
git add frontend/.env.production
git commit -m "Update: Connect to production backend"
git push
```

---

**Once you have your backend URL, update the environment variable and redeploy!** 🚀
