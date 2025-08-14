#!/bin/bash

# Billboard Sentinel Deployment Script
# This script helps deploy the app to different platforms

set -e

echo "🚀 Billboard Sentinel Deployment Script"
echo "========================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to deploy locally
deploy_local() {
    echo "📦 Deploying locally with Docker..."
    cd backend
    docker-compose up --build -d
    echo "✅ Backend deployed locally at http://localhost:8000"
    echo "📊 Dashboard available at http://localhost:8000/static/dashboard/index.html"
    echo "🔗 API docs at http://localhost:8000/docs"
}

# Function to deploy to production (Heroku-like)
deploy_production() {
    echo "🌐 Deploying to production..."
    
    # Build the React dashboard
    echo "🔨 Building React dashboard..."
    cd react_dashboard
    npm install
    npm run build
    
    # Copy built files to backend static folder
    echo "📁 Copying built files..."
    mkdir -p ../backend/static/dashboard
    cp -r dist/* ../backend/static/dashboard/
    
    cd ../backend
    
    # Create production Dockerfile
    cat > Dockerfile.prod << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

    echo "🐳 Building production Docker image..."
    docker build -f Dockerfile.prod -t billboard-sentinel:latest .
    
    echo "✅ Production image built successfully!"
    echo "🚀 To deploy to your preferred platform:"
    echo "   - AWS ECS: Use the Docker image with ECS task definition"
    echo "   - Google Cloud Run: gcloud run deploy --image billboard-sentinel:latest"
    echo "   - Azure Container Instances: az container create --image billboard-sentinel:latest"
    echo "   - Heroku: heroku container:push web"
}

# Function to deploy to cloud platforms
deploy_cloud() {
    echo "☁️  Cloud deployment options:"
    echo ""
    echo "1. AWS ECS:"
    echo "   - Build and push to ECR"
    echo "   - Create ECS cluster and service"
    echo ""
    echo "2. Google Cloud Run:"
    echo "   - Build and push to Container Registry"
    echo "   - Deploy with Cloud Run"
    echo ""
    echo "3. Azure Container Instances:"
    echo "   - Build and push to Container Registry"
    echo "   - Deploy with ACI"
    echo ""
    echo "4. Heroku:"
    echo "   - Install Heroku CLI"
    echo "   - heroku create"
    echo "   - heroku container:push web"
    echo ""
    echo "5. Railway:"
    echo "   - Connect GitHub repo"
    echo "   - Auto-deploy on push"
}

# Main menu
echo ""
echo "Choose deployment option:"
echo "1) Deploy locally with Docker"
echo "2) Build production image"
echo "3) Show cloud deployment options"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_local
        ;;
    2)
        deploy_production
        ;;
    3)
        deploy_cloud
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment completed successfully!"
echo "📚 For more information, check the docs/ folder"
