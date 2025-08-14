#!/bin/bash

# Billboard Sentinel Cloud Deployment Script
# This script helps deploy to cloud platforms without requiring Docker locally

set -e

echo "🚀 Billboard Sentinel Cloud Deployment Script"
echo "=============================================="

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Check if user is logged in
    if ! railway whoami &> /dev/null; then
        echo "🔐 Please login to Railway..."
        railway login
    fi
    
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo "✅ Deployment completed! Check Railway dashboard for your URL."
}

# Function to deploy to Heroku
deploy_heroku() {
    echo "🦸 Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI is not installed."
        echo "📦 Install it first:"
        echo "   macOS: brew install heroku/brew/heroku"
        echo "   Windows: Download from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if user is logged in
    if ! heroku auth:whoami &> /dev/null; then
        echo "🔐 Please login to Heroku..."
        heroku login
    fi
    
    # Create app if it doesn't exist
    if [ -z "$HEROKU_APP_NAME" ]; then
        echo "🏗️  Creating new Heroku app..."
        heroku create
    else
        echo "🔗 Using existing Heroku app: $HEROKU_APP_NAME"
        heroku git:remote -a $HEROKU_APP_NAME
    fi
    
    # Set stack to container
    echo "📦 Setting stack to container..."
    heroku stack:set container
    
    # Deploy
    echo "🚀 Deploying to Heroku..."
    git add .
    git commit -m "Deploy to Heroku" || true
    git push heroku main || git push heroku master
    
    echo "✅ Deployment completed! Check Heroku dashboard for your URL."
}

# Function to deploy to Google Cloud Run
deploy_gcp() {
    echo "☁️  Deploying to Google Cloud Run..."
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        echo "❌ Google Cloud CLI is not installed."
        echo "📦 Install it first:"
        echo "   macOS: brew install google-cloud-sdk"
        echo "   Or download from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo "🔐 Please login to Google Cloud..."
        gcloud auth login
    fi
    
    # Get project ID
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ No project ID set. Please set one:"
        echo "   gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
    
    echo "🏗️  Using project: $PROJECT_ID"
    
    # Enable required APIs
    echo "🔧 Enabling required APIs..."
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    # Build and deploy
    echo "🚀 Building and deploying to Cloud Run..."
    cd backend
    gcloud builds submit --tag gcr.io/$PROJECT_ID/billboard-sentinel
    gcloud run deploy billboard-sentinel \
        --image gcr.io/$PROJECT_ID/billboard-sentinel \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated
    
    echo "✅ Deployment completed! Check Cloud Run console for your URL."
}

# Function to show deployment options
show_options() {
    echo ""
    echo "Available deployment options:"
    echo "1) Railway (Recommended - Free, Fast, Easy)"
    echo "2) Heroku (Free tier available)"
    echo "3) Google Cloud Run (Free tier available)"
    echo "4) Show all options"
    echo "5) Exit"
    echo ""
}

# Function to show all options
show_all_options() {
    echo ""
    echo "🌐 All Deployment Options:"
    echo ""
    echo "🚂 Railway (Recommended for Hackathons):"
    echo "   - Free tier available"
    echo "   - Automatic deployments from GitHub"
    echo "   - Easy setup and management"
    echo "   - Perfect for prototypes and demos"
    echo ""
    echo "🦸 Heroku:"
    echo "   - Free tier available"
    echo "   - Container-based deployment"
    echo "   - Good for small to medium apps"
    echo ""
    echo "☁️  Google Cloud Run:"
    echo "   - Free tier available"
    echo "   - Serverless containers"
    echo "   - Pay only for what you use"
    echo ""
    echo "☁️  AWS ECS:"
    echo "   - More complex setup"
    echo "   - Good for production workloads"
    echo "   - Free tier available"
    echo ""
    echo "🚀 Vercel/Netlify:"
    echo "   - Great for frontend deployment"
    echo "   - Can be combined with backend"
    echo ""
    echo "💡 Recommendation: Start with Railway for quick deployment!"
}

# Main menu
echo ""
echo "Choose deployment option:"
echo "1) Railway (Recommended)"
echo "2) Heroku"
echo "3) Google Cloud Run"
echo "4) Show all options"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_railway
        ;;
    2)
        deploy_heroku
        ;;
    3)
        deploy_gcp
        ;;
    4)
        show_all_options
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📚 Check DEPLOYMENT.md for detailed instructions"
echo "🔗 Your app should be accessible at the provided URL"
