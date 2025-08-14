#!/bin/bash

# Quick Railway Deployment for Billboard Sentinel
echo "🚂 Deploying Billboard Sentinel to Railway..."

# Install Railway CLI if not present
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login if needed
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

# Deploy
echo "🚀 Deploying..."
railway up

echo "✅ Deployment completed!"
echo "🔗 Check Railway dashboard for your URL"
echo "📊 Your app should be live in a few minutes!"
