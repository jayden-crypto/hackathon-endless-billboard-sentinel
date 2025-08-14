# 🚨 Billboard Sentinel - Civic Tech App

A modern civic reporting platform for detecting and reporting unauthorized billboards. Built with React, FastAPI, and mobile-first design.

## 🌟 Features

- **📱 Mobile-First Design** - Optimized for phone and tablet use
- **📸 Camera Integration** - Real-time photo capture for reports
- **📍 GPS Location** - Automatic location detection
- **📊 Admin Dashboard** - Complete case management system
- **🌐 Progressive Web App** - Works offline and can be installed
- **📋 Report Management** - Track status and progress

## 🚀 Live Demo

**Frontend Dashboard:** [Your GitHub Pages URL will go here]
**Backend API:** [Your deployed backend URL will go here]

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, CSS3
- **Backend:** FastAPI, Python 3.11
- **Database:** PostgreSQL with PostGIS
- **Mobile:** Progressive Web App (PWA)
- **Deployment:** GitHub Pages, Railway, Docker

## 📱 Mobile Experience

- **Touch-optimized** interface
- **Camera access** for photo capture
- **GPS integration** for location
- **Responsive design** for all screen sizes
- **Offline capability** with service workers

## 🎯 Use Cases

- **City Planning Departments** - Track unauthorized structures
- **Civic Engagement** - Citizen reporting platform
- **Code Enforcement** - Manage compliance cases
- **Community Safety** - Report hazardous billboards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/billboard-sentinel.git
cd billboard-sentinel

# Frontend
cd react_dashboard
npm install
npm run dev

# Backend
cd ../backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📱 Mobile Testing

1. **Same WiFi Network:** Use the Network URL from Vite dev server
2. **Public Access:** Deploy to GitHub Pages or Railway
3. **QR Code:** Generate QR code for easy mobile access

## 🚀 Deployment

### GitHub Pages (Frontend)
```bash
# Build the app
cd react_dashboard
npm run build

# Deploy to GitHub Pages
# Enable GitHub Pages in your repository settings
# Point to /docs folder or gh-pages branch
```

### Railway (Backend)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up
```

## 📁 Project Structure

```
billboard-sentinel/
├── react_dashboard/          # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main dashboard
│   │   ├── UserReport.jsx  # User reporting interface
│   │   └── App.css         # Styles
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── models.py       # Database models
│   │   └── routers/        # API endpoints
│   └── requirements.txt
├── mobile_flutter_complete/ # Flutter mobile app
├── docs/                    # Documentation
└── deployment/              # Deployment scripts
```

## 🎨 UI Components

- **Admin Dashboard** - Case management and analytics
- **User Report Interface** - Photo capture and submission
- **Statistics Cards** - Key metrics display
- **Interactive Reports** - Clickable report cards
- **Details Panel** - Comprehensive case information

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `GET /api/reports` - List all reports
- `POST /api/reports` - Submit new report
- `PATCH /api/reports/{id}` - Update report status
- `POST /api/registry/seed` - Seed database

## 📊 Features

- **Real-time Updates** - Live data refresh
- **Export Functionality** - CSV data export
- **Status Management** - Track case progress
- **Geospatial Data** - Location-based reporting
- **Image Handling** - Photo storage and display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the backend framework
- **React** for the frontend framework
- **Vite** for the build tool
- **OpenStreetMap** for mapping data
- **Civic Tech Community** for inspiration

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/billboard-sentinel/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/billboard-sentinel/discussions)
- **Email:** [Your Email]

---

**Built with ❤️ for safer, more beautiful communities**
