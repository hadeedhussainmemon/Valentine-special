# 🚀 How to Deploy "HeartString" to Vercel

Your "Valentine-as-a-Service" app is fully configured for a seamless deployment. Follow these steps:

## 1. Push to GitHub
If you haven't already:
1.  Initialize Git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Ready for deploy"`
4.  Create a new repo on GitHub and push.

## 2. Import in Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.

## 3. Configure Project
Vercel should auto-detect "Vite". Verify these settings if asked:
*   **Framework Preset**: Vite
*   **Root Directory**: `./` (default)
*   **Build Command**: `vite build` (or `npm run build`)
*   **Output Directory**: `dist`

## 4. Environment Variables (Critical!) 🔑
Before clicking Deploy, expand the **"Environment Variables"** section and add these:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Connection String. |
| `ADMIN_PASSWORD` | `bemy` | Password for the Admin Dashboard. |

*(Note: Data will not save if you don't add `MONGODB_URI`)*

## 5. Deploy & Viral!
Click **"Deploy"**.
*   Vercel will build your frontend.
*   It will set up the API functions.
*   Once done, you will get a live URL (e.g., `heartstring.vercel.app`).

---

### How to Use After Deployment:
1.  Open your **Live URL**.
2.  Enter your Name (e.g., "Alex") and a Secret Note.
3.  Click "Create Magic Link".
4.  **Send that link** to your Valentine! 💌
5.  Watch their reaction (and check the Admin Panel for the "Yes"!).
