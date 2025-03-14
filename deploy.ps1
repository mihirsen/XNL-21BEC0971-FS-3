# Smart City Application Deployment Script for Windows
# This script automates the build and deployment of the Smart City application to Kubernetes

Write-Host "Starting deployment process for Smart City application..." -ForegroundColor Green

# Step 1: Build Docker images
Write-Host "Building Docker images..." -ForegroundColor Yellow

# Build frontend image
Write-Host "Building frontend image..." -ForegroundColor Yellow
docker build -t smart-city/frontend:latest ./frontend

# Build backend image
Write-Host "Building backend image..." -ForegroundColor Yellow
docker build -t smart-city/backend:latest ./backend

Write-Host "Docker images built successfully!" -ForegroundColor Green

# Step 2: Apply Kubernetes manifests
Write-Host "Deploying to Kubernetes..." -ForegroundColor Yellow

# Create namespace if it doesn't exist
kubectl create namespace smartcity --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets first
Write-Host "Applying secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/secrets.yaml -n smartcity

# Apply MongoDB deployment
Write-Host "Deploying MongoDB..." -ForegroundColor Yellow
kubectl apply -f k8s/mongodb-deployment.yaml -n smartcity

# Apply Redis deployment
Write-Host "Deploying Redis..." -ForegroundColor Yellow
kubectl apply -f k8s/redis-deployment.yaml -n smartcity

# Wait for database to be ready
Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Apply backend deployment
Write-Host "Deploying backend service..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml -n smartcity

# Apply frontend deployment
Write-Host "Deploying frontend service..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml -n smartcity

# Apply ingress rules
Write-Host "Configuring ingress..." -ForegroundColor Yellow
kubectl apply -f k8s/ingress.yaml -n smartcity

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "The application will be available at http://smartcity.local once all pods are running." -ForegroundColor Cyan
Write-Host "You may need to add 'smartcity.local' to your hosts file for local development." -ForegroundColor Cyan

# Display pod status
Write-Host "Checking pod status..." -ForegroundColor Yellow
kubectl get pods -n smartcity

Write-Host "Deployment process completed!" -ForegroundColor Green 