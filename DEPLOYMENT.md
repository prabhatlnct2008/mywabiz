# mywabiz Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Environment Variables](#environment-variables)

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas free tier)

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended for simplicity)**
1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0 tier)
3. Create a database user
4. Get your connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mywabiz`

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Connection string for local
MONGODB_URL=mongodb://localhost:27017/mywabiz
```

### Step 2: Backend Setup

```bash
cd /home/user/mywabiz/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mywabiz

# Auth
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Google Sheets (for catalog sync)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

**Start backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 3: Frontend Setup

```bash
cd /home/user/mywabiz/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Start frontend:**
```bash
npm run dev
```

Frontend will be at: http://localhost:5173

### Step 4: Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "Google+ API" and "Google Sheets API"
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Application type: Web application
6. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:8000`
7. Authorized redirect URIs:
   - `http://localhost:8000/api/v1/auth/google/callback`
8. Copy Client ID and Client Secret to your `.env` files

### Step 5: Test the Flow

1. Open http://localhost:5173
2. Click "Sign in with Google"
3. Complete OAuth flow
4. You should be redirected to the onboarding wizard
5. Create a store and test the features

---

## Production Deployment

### Architecture
```
┌─────────────────┐     ┌──────────────────────┐
│   Vercel        │────▶│   Render / Railway   │
│   (Frontend)    │     │   (Backend API)      │
│   React/Vite    │     │   FastAPI/Uvicorn    │
└─────────────────┘     └──────────────────────┘
         │                        │
         │                        ▼
         │              ┌──────────────────────┐
         └─────────────▶│   MongoDB Atlas      │
                        │   (Database)         │
                        └──────────────────────┘
```

### Backend Hosting Comparison

| Platform | Free Tier | Cold Start | Custom Domain | Best For |
|----------|-----------|------------|---------------|----------|
| **Render** ⭐ | 750 hrs/mo | ~30s | Yes (paid) | Easiest setup |
| **Railway** | $5 credit/mo | Fast | Yes | Best DX |
| **Fly.io** | 3 VMs | Fast | Yes | Global edge |
| **PythonAnywhere** | Limited | N/A | Paid only | Simple apps |

---

## Option A: Deploy Backend to Render (Recommended)

### A.1 Create render.yaml

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: mywabiz-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### A.2 Deploy to Render

1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (`mywabiz`)
4. Configure:
   - **Name**: `mywabiz-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### A.3 Set Environment Variables

In Render dashboard → Environment tab, add:

```
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/mywabiz
JWT_SECRET=your-production-secret-32chars
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_REDIRECT_URI=https://mywabiz-api.onrender.com/api/v1/auth/google/callback
FRONTEND_URL=https://mywabiz.vercel.app
BACKEND_URL=https://mywabiz-api.onrender.com
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### A.4 Deploy

Click **"Create Web Service"**. Render will:
- Build your app automatically
- Deploy to `https://mywabiz-api.onrender.com`
- Auto-deploy on every git push

> **Note**: Free tier sleeps after 15 min inactivity. First request takes ~30s to wake. Upgrade to Starter ($7/mo) for always-on.

---

## Option B: Deploy Backend to Railway

### B.1 Deploy to Railway

1. Go to https://railway.app → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `mywabiz` repository
4. Set **Root Directory**: `backend`

### B.2 Configure Build

Railway auto-detects Python. Add a `Procfile` in `backend/`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### B.3 Set Environment Variables

In Railway dashboard → Variables tab, add same variables as Render above.

Your API is at: `https://mywabiz-api.up.railway.app`

---

## Option C: Deploy Backend to PythonAnywhere

### C.1 Create PythonAnywhere Account
- Go to https://www.pythonanywhere.com
- Sign up for a free account (or paid for custom domain)

#### 1.2 Upload Code
```bash
# In PythonAnywhere Bash console
cd ~
git clone https://github.com/yourusername/mywabiz.git
cd mywabiz/backend
```

Or upload via Files tab.

#### 1.3 Create Virtual Environment
```bash
mkvirtualenv --python=/usr/bin/python3.11 mywabiz
workon mywabiz
pip install -r requirements.txt
pip install uvicorn gunicorn
```

#### 1.4 Configure Web App
1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration" → Python 3.11
4. Set Source code: `/home/yourusername/mywabiz/backend`
5. Set Virtualenv: `/home/yourusername/.virtualenvs/mywabiz`

#### 1.5 Edit WSGI Configuration
Click on the WSGI configuration file link and replace contents:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/mywabiz/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['MONGODB_URL'] = 'mongodb+srv://...'
os.environ['JWT_SECRET'] = 'your-production-secret'
os.environ['GOOGLE_CLIENT_ID'] = 'your-google-client-id'
os.environ['GOOGLE_CLIENT_SECRET'] = 'your-google-client-secret'
os.environ['GOOGLE_REDIRECT_URI'] = 'https://yourusername.pythonanywhere.com/api/v1/auth/google/callback'
os.environ['FRONTEND_URL'] = 'https://mywabiz.vercel.app'
os.environ['BACKEND_URL'] = 'https://yourusername.pythonanywhere.com'
os.environ['CLOUDINARY_CLOUD_NAME'] = 'your-cloud-name'
os.environ['CLOUDINARY_API_KEY'] = 'your-api-key'
os.environ['CLOUDINARY_API_SECRET'] = 'your-api-secret'
# Add GOOGLE_SERVICE_ACCOUNT_JSON if using Sheets sync

from app.main import app as application
```

#### 1.6 Reload Web App
Click "Reload" button on the Web tab.

Your API is now at: `https://yourusername.pythonanywhere.com`

### Step 2: Deploy Frontend to Vercel

#### 2.1 Push to GitHub
```bash
cd /home/user/mywabiz
git push origin claude/create-planning-docs-018RGN5jHcP7oyrx5KH3qgCe
```

#### 2.2 Connect to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your `mywabiz` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 2.3 Set Environment Variables
In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://yourusername.pythonanywhere.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

#### 2.4 Deploy
Click "Deploy" and wait for build to complete.

Your frontend is now at: `https://mywabiz.vercel.app` (or your custom domain)

### Step 3: Update OAuth Settings

Go back to Google Cloud Console and add production URLs:

**Authorized JavaScript origins:**
- `https://mywabiz.vercel.app`
- `https://yourusername.pythonanywhere.com`

**Authorized redirect URIs:**
- `https://yourusername.pythonanywhere.com/api/v1/auth/google/callback`

### Step 4: Custom Domain (Optional)

#### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add `mywabiz.in` or your domain
3. Update DNS records as instructed

#### PythonAnywhere (Backend)
1. Upgrade to paid plan ($5/month)
2. Go to Web tab → add custom domain
3. Add CNAME record: `api.mywabiz.in` → `yourusername.pythonanywhere.com`

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mywabiz` |
| `JWT_SECRET` | Secret for JWT signing (generate random 32+ chars) | `your-super-secret-key` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `10080` (7 days) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `GOCSPX-xxx` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://api.mywabiz.in/api/v1/auth/google/callback` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Service account for Sheets API | `{"type":"service_account",...}` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | `xxx` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://mywabiz.in` |
| `BACKEND_URL` | Backend URL | `https://api.mywabiz.in` |

### Frontend (.env.local / Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.mywabiz.in` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |

---

## Quick Start Scripts

### Local Development (run both together)

Create `start-dev.sh` in project root:
```bash
#!/bin/bash

# Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
```

Run with:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend domain exactly
- Check browser console for the specific origin being blocked

### OAuth Errors
- Verify redirect URIs match exactly (including trailing slashes)
- Ensure both client ID and secret are correct
- Check that APIs are enabled in Google Cloud Console

### MongoDB Connection Issues
- Whitelist your IP in MongoDB Atlas Network Access
- For PythonAnywhere, whitelist their IP ranges (see their docs)

### PythonAnywhere 502 Errors
- Check error logs in the Web tab
- Ensure all environment variables are set
- Try reloading the web app

### Vercel Build Failures
- Check build logs for missing dependencies
- Ensure `frontend` is set as root directory
- Verify environment variables are set
