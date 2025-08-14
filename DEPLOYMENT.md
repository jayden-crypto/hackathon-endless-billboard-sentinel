# Billboard Sentinel - Deployment Guide

This guide covers deploying the Billboard Sentinel application to various platforms.

## 🚀 Quick Start

### Option 1: Use the Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

## 📦 Local Deployment

### Prerequisites
- Docker and Docker Compose installed
- Python 3.11+ (for local development)

### Steps
1. **Clone and navigate to the project:**
   ```bash
   cd backend
   ```

2. **Deploy with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application:**
   - Backend API: http://localhost:8000
   - Dashboard: http://localhost:8000/static/dashboard/index.html
   - API Docs: http://localhost:8000/docs

4. **Seed the database:**
   ```bash
   curl -X POST http://localhost:8000/api/registry/seed
   ```

## ☁️ Cloud Deployment

### Railway (Recommended for Hackathons)

Railway is perfect for hackathons - it's free, fast, and easy to use.

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize and deploy:**
   ```bash
   railway init
   railway up
   ```

4. **Get your deployment URL:**
   ```bash
   railway status
   ```

### Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create a new app:**
   ```bash
   heroku create your-billboard-sentinel-app
   ```

4. **Set stack to container:**
   ```bash
   heroku stack:set container
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Google Cloud Run

1. **Install Google Cloud CLI:**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

4. **Build and deploy:**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/billboard-sentinel
   gcloud run deploy billboard-sentinel \
     --image gcr.io/YOUR_PROJECT_ID/billboard-sentinel \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### AWS ECS

1. **Install AWS CLI:**
   ```bash
   # macOS
   brew install awscli
   
   # Or download from: https://aws.amazon.com/cli/
   ```

2. **Configure AWS:**
   ```bash
   aws configure
   ```

3. **Create ECR repository:**
   ```bash
   aws ecr create-repository --repository-name billboard-sentinel
   ```

4. **Build and push:**
   ```bash
   cd backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   docker build -t billboard-sentinel .
   docker tag billboard-sentinel:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/billboard-sentinel:latest
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/billboard-sentinel:latest
   ```

5. **Create ECS cluster and service (use AWS Console or CloudFormation)**

## 🔧 Environment Configuration

### Required Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
ENVIRONMENT=production
PORT=8000
```

### Optional Environment Variables
```bash
# For production database
POSTGRES_DB=billboard_sentinel
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# For external services
REDIS_URL=redis://localhost:6379
```

## 📱 Mobile App Deployment

### Flutter App
1. **Build APK:**
   ```bash
   cd mobile_flutter_complete
   flutter build apk --release
   ```

2. **Build iOS (requires macOS):**
   ```bash
   flutter build ios --release
   ```

3. **Distribute:**
   - Android: Upload APK to Google Play Console
   - iOS: Upload to App Store Connect

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process
   kill -9 PID
   ```

2. **Database connection issues:**
   - Check if database service is running
   - Verify connection string
   - Ensure database is accessible

3. **Docker build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission issues:**
   ```bash
   chmod +x deploy.sh
   chmod +x backend/run.sh
   ```

### Health Checks

Test your deployment:
```bash
# Check if backend is running
curl http://your-domain.com/docs

# Check database connection
curl http://your-domain.com/api/registry/seed

# Test report submission
curl -F 'lat=30.354' -F 'lon=76.366' -F "detections_json=@detections_example.json;type=application/json" http://your-domain.com/api/reports
```

## 📊 Monitoring

### Basic Monitoring
- Check application logs: `docker-compose logs -f web`
- Monitor resource usage: `docker stats`
- Health check endpoint: `/docs`

### Production Monitoring
- Set up logging aggregation (ELK stack, CloudWatch, etc.)
- Implement metrics collection (Prometheus, DataDog, etc.)
- Set up alerting for critical failures

## 🔒 Security Considerations

1. **Environment Variables:** Never commit secrets to version control
2. **Database:** Use strong passwords and restrict access
3. **HTTPS:** Always use HTTPS in production
4. **CORS:** Configure CORS properly for your domain
5. **Rate Limiting:** Implement rate limiting for API endpoints

## 📚 Additional Resources

- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Heroku Container Registry](https://devcenter.heroku.com/articles/container-registry-and-runtime)
- [Google Cloud Run Tutorial](https://cloud.google.com/run/docs/quickstarts/build-and-deploy)

## 🆘 Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs web`
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation
5. Review the `docs/` folder for architecture details

---

**Happy Deploying! 🎉**
