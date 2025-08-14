# 🚀 Quick Deploy - Billboard Sentinel

## ⚡ One-Command Deployment

### Option 1: Railway (Recommended - Easiest)
```bash
./deploy-railway.sh
```

### Option 2: Full Cloud Options
```bash
./deploy-cloud.sh
```

### Option 3: Local with Docker
```bash
./deploy.sh
```

## 🎯 What Gets Deployed

- ✅ **Backend API** (FastAPI) - Handles reports, registry, stats
- ✅ **React Dashboard** - Interactive map and data visualization
- ✅ **Database** - PostgreSQL with PostGIS for location data
- ✅ **Mobile API** - Endpoints for Flutter app

## 🌐 Deployment URLs

After deployment, you'll get:
- **API**: `https://your-app.railway.app`
- **Dashboard**: `https://your-app.railway.app/static/dashboard/index.html`
- **API Docs**: `https://your-app.railway.app/docs`

## 🔧 Quick Test

Test your deployment:
```bash
# Check if it's running
curl https://your-app.railway.app/docs

# Seed the database
curl -X POST https://your-app.railway.app/api/registry/seed
```

## 📱 Mobile App

The Flutter app will automatically connect to your deployed backend. Just update the API URL in the app configuration.

## 🆘 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Check `docs/` for architecture details
- Railway has excellent documentation and support

---

**Ready to deploy? Run: `./deploy-railway.sh`** 🚀

