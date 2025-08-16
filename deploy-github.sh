#!/bin/bash

# Billboard Sentinel - GitHub Pages Deployment Script

echo "🚀 Deploying Billboard Sentinel to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "react_dashboard/package.json" ]; then
    echo "❌ Error: Please run this script from the hackathon directory"
    exit 1
fi

# Build the React app
echo "🔨 Building React app..."
cd react_dashboard
npm run build

# Create docs directory for GitHub Pages
echo "📁 Creating docs directory..."
cd ..
mkdir -p docs
cp -r react_dashboard/dist/* docs/

# Add docs to git
echo "📝 Adding docs to git..."
git add docs/
git commit -m "📱 Deploy to GitHub Pages - built React app"

echo ""
echo "✅ Build completed! Now follow these steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/billboard-sentinel.git"
echo "   git push -u origin main"
echo ""
echo "2. Enable GitHub Pages:"
echo "   - Go to your repository on GitHub"
echo "   - Click Settings → Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main, folder: /docs"
echo "   - Click Save"
echo ""
echo "3. Your app will be available at:"
echo "   https://YOUR_USERNAME.github.io/billboard-sentinel/"
echo ""
echo "🎉 Share this URL with anyone - no WiFi required!"
