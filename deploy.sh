#!/bin/bash

# Smart City Application Deployment Script
# This script automates the build and deployment of the Smart City application to Kubernetes

set -e  # Exit on error

echo -e "\e[32mStarting deployment process for Smart City application...\e[0m"

# Step 1: Build Docker images
echo -e "\e[33mBuilding Docker images...\e[0m"

# Build frontend image
echo -e "\e[33mBuilding frontend image...\e[0m"
docker build -t smart-city/frontend:latest ./frontend

# Build backend image
echo -e "\e[33mBuilding backend image...\e[0m"
docker build -t smart-city/backend:latest ./backend

echo -e "\e[32mDocker images built successfully!\e[0m"

# Step 2: Apply Kubernetes manifests
echo -e "\e[33mDeploying to Kubernetes...\e[0m"

# Create namespace if it doesn't exist
kubectl create namespace smartcity --dry-run=client -o yaml | kubectl apply -f -

# Apply secrets first
echo -e "\e[33mApplying secrets...\e[0m"
kubectl apply -f k8s/secrets.yaml -n smartcity

# Apply MongoDB deployment
echo -e "\e[33mDeploying MongoDB...\e[0m"
kubectl apply -f k8s/mongodb-deployment.yaml -n smartcity

# Apply Redis deployment
echo -e "\e[33mDeploying Redis...\e[0m"
kubectl apply -f k8s/redis-deployment.yaml -n smartcity

# Wait for database to be ready
echo -e "\e[33mWaiting for database to be ready...\e[0m"
sleep 10

# Apply backend deployment
echo -e "\e[33mDeploying backend service...\e[0m"
kubectl apply -f k8s/backend-deployment.yaml -n smartcity

# Apply frontend deployment
echo -e "\e[33mDeploying frontend service...\e[0m"
kubectl apply -f k8s/frontend-deployment.yaml -n smartcity

# Apply ingress rules
echo -e "\e[33mConfiguring ingress...\e[0m"
kubectl apply -f k8s/ingress.yaml -n smartcity

echo -e "\e[32mDeployment completed successfully!\e[0m"
echo -e "\e[36mThe application will be available at http://smartcity.local once all pods are running.\e[0m"
echo -e "\e[36mYou may need to add 'smartcity.local' to your hosts file for local development.\e[0m"

# Display pod status
echo -e "\e[33mChecking pod status...\e[0m"
kubectl get pods -n smartcity

echo -e "\e[32mDeployment process completed!\e[0m" 