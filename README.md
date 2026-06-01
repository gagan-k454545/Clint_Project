# PitchID — AI Video Resume Platform

> Replace boring resumes with AI-powered video profiles. Record once, share everywhere via QR code.

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
1. Create a new repo at github.com
2. Upload this project folder to it

### Step 2 — Import in Vercel
1. Go to vercel.com → **Add New Project**
2. Import your GitHub repo
3. Framework will auto-detect as **Next.js**

### Step 3 — Add Environment Variables
In Vercel project settings → **Environment Variables**, add these:

| Variable | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://gagan:PASSWORD@cluster0.jtnvhcm.mongodb.net/pitchid?retryWrites=true&w=majority&appName=Cluster0` |
| `NEXTAUTH_SECRET` | Any random string (32+ chars) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (your actual Vercel URL) |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | From cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | From cloudinary.com dashboard |
| `GROQ_API_KEY` | From console.groq.com |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console (optional) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console (optional) |

### Step 4 — Deploy
Click **Deploy**. Done.

---

## 💻 Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create your local env file (copy from example and fill in values)
cp .env.example .env.local

# Run dev server
npm run dev
```

Open http://localhost:3000

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                    # API routes (auth, upload, AI, QR)
│   ├── auth/                   # Login & Signup pages
│   ├── dashboard/
│   │   ├── candidate/          # Full candidate workflow
│   │   └── recruiter/          # Recruiter management
│   └── candidate/[id]/         # Public profile page (QR destination)
├── components/
│   ├── ui/                     # Button, Card, Input, Toast etc.
│   ├── layout/                 # Navbar, Footer, DashboardLayout
│   └── candidate/              # PublicProfile component
├── lib/                        # MongoDB, Cloudinary, AI, Auth
├── models/                     # Mongoose schemas
└── middleware.ts               # Route protection
```

---

## ⚙️ Tech Stack

- **Next.js 16** (App Router) — framework
- **NextAuth.js** — authentication + Google OAuth
- **MongoDB Atlas** — database
- **Cloudinary** — video, resume, and image storage
- **Groq (llama-3.3-70b)** — AI script generation
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations

---

## 🔑 Important After Deploying

1. In **Google Cloud Console** → OAuth → add your Vercel URL to authorized redirect URIs:
   `https://your-app.vercel.app/api/auth/callback/google`

2. In **MongoDB Atlas** → Network Access → allow `0.0.0.0/0`

3. Update `NEXTAUTH_URL` in Vercel env vars to your actual deployed URL
