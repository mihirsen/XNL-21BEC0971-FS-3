# Smart City Application - Kubernetes Deployment Guide

This guide provides instructions for deploying the Smart City application on a Kubernetes cluster. The application consists of a frontend, backend, MongoDB database, and Redis cache.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Scripts](#deployment-scripts)
- [Manual Deployment Steps](#manual-deployment-steps)
- [Accessing the Application](#accessing-the-application)
- [Checking Deployment Status](#checking-deployment-status)
- [Troubleshooting](#troubleshooting)
- [Scaling the Application](#scaling-the-application)
- [Cleaning Up](#cleaning-up)
- [Additional Configuration](#additional-configuration)

## Prerequisites

Before deploying the Smart City application, ensure you have the following:

- Docker installed and running
- A Kubernetes cluster (local or remote)
- `kubectl` CLI tool installed and configured to connect to your cluster
- Git (to clone the repository if needed)

## Deployment Scripts

We provide several scripts to simplify the deployment process:

### Setup Scripts

- `setup-local-k8s.sh` (Linux/macOS) or `setup-local-k8s.ps1` (Windows): Sets up a local Kubernetes environment, including:
  - Checking Docker and Kubernetes installation
  - Installing the Nginx Ingress Controller
  - Adding the required host entry to your hosts file
  - Creating the `smartcity` namespace

### Deployment Scripts

- `deploy.sh` (Linux/macOS) or `deploy.ps1` (Windows): Automates the deployment process:
  - Builds Docker images for frontend and backend
  - Creates the `smartcity` namespace
  - Applies all Kubernetes manifests in the correct order
  - Displays the status of the deployment

### Status Check Scripts

- `check-status.sh` (Linux/macOS) or `check-status.ps1` (Windows): Checks the status of the deployment:
  - Verifies all pods, services, and deployments are running
  - Identifies any issues with pods
  - Tests application accessibility

### Cleanup Scripts

- `cleanup.sh` (Linux/macOS) or `cleanup.ps1` (Windows): Removes all resources:
  - Deletes the `smartcity` namespace and all resources within it
  - Optionally removes Docker images

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

1. **Build Docker Images**:

   ```bash
   # Build frontend image
   docker build -t smart-city/frontend:latest ./frontend

   # Build backend image
   docker build -t smart-city/backend:latest ./backend
   ```

2. **Create Namespace**:

   ```bash
   kubectl create namespace smartcity
   ```

3. **Apply Kubernetes Manifests**:
   Apply the manifests in the following order:

   ```bash
   # Apply secrets first
   kubectl apply -f k8s/secrets.yaml -n smartcity

   # Apply MongoDB deployment
   kubectl apply -f k8s/mongodb-deployment.yaml -n smartcity

   # Apply Redis deployment
   kubectl apply -f k8s/redis-deployment.yaml -n smartcity

   # Wait for database to be ready (about 10 seconds)
   sleep 10

   # Apply backend deployment
   kubectl apply -f k8s/backend-deployment.yaml -n smartcity

   # Apply frontend deployment
   kubectl apply -f k8s/frontend-deployment.yaml -n smartcity

   # Apply ingress rules
   kubectl apply -f k8s/ingress.yaml -n smartcity
   ```

## Accessing the Application

Once deployed, the application will be available at:

- **URL**: http://smartcity.local

For local development, you need to add an entry to your hosts file:

- **Linux/macOS**: `/etc/hosts`
- **Windows**: `C:\Windows\System32\drivers\etc\hosts`

Add the following line:

```
127.0.0.1 smartcity.local
```

## Checking Deployment Status

To check the status of your deployment:

```bash
# Check pod status
kubectl get pods -n smartcity

# Check services
kubectl get services -n smartcity

# Check ingress
kubectl get ingress -n smartcity
```

Alternatively, run the status check script:

```bash
# Linux/macOS
./check-status.sh

# Windows
.\check-status.ps1
```

## Troubleshooting

### Pods Not Starting

If pods are not starting, check the logs:

```bash
kubectl logs <pod-name> -n smartcity
```

For more detailed information:

```bash
kubectl describe pod <pod-name> -n smartcity
```

### Network Issues

If you can't access the application:

1. Verify the ingress controller is running:

   ```bash
   kubectl get pods -n ingress-nginx
   ```

2. Check your hosts file has the correct entry.

3. Ensure the ingress resource is correctly configured:
   ```bash
   kubectl describe ingress -n smartcity
   ```

### Database Connection Issues

If the backend can't connect to MongoDB:

1. Check MongoDB pod is running:

   ```bash
   kubectl get pods -n smartcity | grep mongodb
   ```

2. Verify the service is working:
   ```bash
   kubectl describe service mongodb-service -n smartcity
   ```

## Scaling the Application

To scale the application:

```bash
# Scale the backend
kubectl scale deployment backend-deployment --replicas=3 -n smartcity

# Scale the frontend
kubectl scale deployment frontend-deployment --replicas=2 -n smartcity
```

## Cleaning Up

To remove all resources:

```bash
# Using the cleanup script
# Linux/macOS
./cleanup.sh

# Windows
.\cleanup.ps1

# Or manually
kubectl delete namespace smartcity
```

## Additional Configuration

### SSL/TLS

To enable HTTPS, modify the ingress configuration in `k8s/ingress.yaml` to include TLS settings.

### Persistent Storage

The MongoDB deployment uses a persistent volume claim. For production, ensure you have appropriate storage classes configured.

### Environment Variables

The application uses environment variables for configuration. Review and modify the following files as needed:

- `k8s/backend-deployment.yaml`: Backend environment variables
- `k8s/frontend-deployment.yaml`: Frontend environment variables
- `k8s/secrets.yaml`: Sensitive information
