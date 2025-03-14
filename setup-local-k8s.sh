#!/bin/bash

# Setup Script for Local Kubernetes Development
# This script sets up a local Kubernetes environment for testing the Smart City application

echo "Setting up local Kubernetes environment for Smart City application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker before continuing."
    exit 1
fi

# Check if Kubernetes is enabled in Docker Desktop (for Windows/Mac users)
echo "Checking if Kubernetes is enabled in Docker Desktop..."
if ! kubectl version &> /dev/null; then
    echo "Kubernetes is not enabled. Please enable Kubernetes in Docker Desktop or install minikube."
    echo "For Docker Desktop: Settings > Kubernetes > Enable Kubernetes"
    echo "For minikube: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

echo "Kubernetes is running!"

# Install Ingress Controller if not already installed
echo "Setting up Ingress Controller..."
if ! kubectl get ns ingress-nginx &> /dev/null; then
    echo "Installing Nginx Ingress Controller..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
    
    # Wait for the ingress controller to be ready
    echo "Waiting for Ingress Controller to be ready..."
    kubectl wait --namespace ingress-nginx \
      --for=condition=ready pod \
      --selector=app.kubernetes.io/component=controller \
      --timeout=120s
else
    echo "Ingress Controller already installed."
fi

# Add hosts entry for smartcity.local
echo "Checking hosts file for smartcity.local entry..."
if grep -q "smartcity.local" /etc/hosts; then
    echo "Host entry already exists for smartcity.local"
else
    echo "Adding smartcity.local to hosts file (requires sudo)..."
    echo "127.0.0.1 smartcity.local" | sudo tee -a /etc/hosts
fi

# Create necessary namespaces
echo "Creating Kubernetes namespace..."
kubectl create namespace smartcity --dry-run=client -o yaml | kubectl apply -f -

echo "Local Kubernetes environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Build your Docker images: ./deploy.sh"
echo "2. Access the application at http://smartcity.local once deployed"
echo ""
echo "Happy developing!" 