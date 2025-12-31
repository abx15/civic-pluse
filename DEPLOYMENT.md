# 🚀 Deployment Guide - CivicPulse

This guide covers how to deploy the CivicPulse application to production.

## 🏗️ Architecture

- **Frontend**: React + Vite (Deploy to Vercel/Netlify)
- **Backend**: Node.js + Express (Deploy to Render/Railway)
- **Database**: MongoDB Atlas

---

## 1. Backend Deployment (Render.com)

1.  Push your code to GitHub.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install`
6.  **Start Command**: `node index.js`
7.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `MONGO_URI`: (Your MongoDB Atlas connection string)
    - `JWT_SECRET`: (Secure random string)
    - `CLOUDINARY_...`: (Your Cloudinary keys)
    - `OPENAI_API_KEY`: (Optional)
    - `SMTP_...`: (Optional for Email)
    - `TWILIO_...`: (Optional for WhatsApp)

---

## 2. Frontend Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import project in Vercel.
3.  **Root Directory**: `client`
4.  **Framework Preset**: `Vite`
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://<your-backend-url>.onrender.com/api`
    - `VITE_SOCKET_URL`: `https://<your-backend-url>.onrender.com`

> **Note**: A `vercel.json` has been added to handle React Router (SPA) routing.

---

## 3. Post-Deployment Verification

1.  Open the deployed frontend URL.
2.  Register a new user.
3.  Report a test issue.
4.  Verify that the issue appears in the feed.

## 4. Mock Services vs Real Services

By default, the app uses **Mock Services** if API keys are missing.

- **AI**: Randomly assigns category/priority.
- **Email**: Logs to server console.
- **WhatsApp**: Logs to server console.

To enable real features, simply add the API keys to your Backend Environment Variables.
