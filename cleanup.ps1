# Smart City Application Cleanup Script for Windows
# This script removes all Kubernetes resources related to the Smart City application

Write-Host "Starting cleanup process for Smart City application..." -ForegroundColor Yellow

# Confirm with the user
$confirm = Read-Host "This will delete all Smart City application resources from the Kubernetes cluster. Continue? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cleanup aborted." -ForegroundColor Red
    exit 1
}

# Delete all resources in the smartcity namespace
Write-Host "Deleting all resources in the smartcity namespace..." -ForegroundColor Yellow
kubectl delete namespace smartcity

# Check if the namespace was deleted
$namespaceExists = kubectl get namespace smartcity 2>$null
if ($namespaceExists) {
    Write-Host "Failed to delete namespace. Trying to delete resources individually..." -ForegroundColor Red
    
    # Delete resources individually
    Write-Host "Deleting ingress..." -ForegroundColor Yellow
    kubectl delete -f k8s/ingress.yaml -n smartcity --ignore-not-found
    
    Write-Host "Deleting frontend deployment..." -ForegroundColor Yellow
    kubectl delete -f k8s/frontend-deployment.yaml -n smartcity --ignore-not-found
    
    Write-Host "Deleting backend deployment..." -ForegroundColor Yellow
    kubectl delete -f k8s/backend-deployment.yaml -n smartcity --ignore-not-found
    
    Write-Host "Deleting Redis deployment..." -ForegroundColor Yellow
    kubectl delete -f k8s/redis-deployment.yaml -n smartcity --ignore-not-found
    
    Write-Host "Deleting MongoDB deployment..." -ForegroundColor Yellow
    kubectl delete -f k8s/mongodb-deployment.yaml -n smartcity --ignore-not-found
    
    Write-Host "Deleting secrets..." -ForegroundColor Yellow
    kubectl delete -f k8s/secrets.yaml -n smartcity --ignore-not-found
    
    # Try to delete the namespace again
    kubectl delete namespace smartcity --ignore-not-found
} else {
    Write-Host "Namespace deleted successfully." -ForegroundColor Green
}

# Optional: Remove Docker images
$removeImages = Read-Host "Do you want to remove the Docker images as well? (y/n)"
if ($removeImages -eq "y" -or $removeImages -eq "Y") {
    Write-Host "Removing Docker images..." -ForegroundColor Yellow
    docker rmi smart-city/frontend:latest smart-city/backend:latest 2>$null
    Write-Host "Docker images removed." -ForegroundColor Green
}

Write-Host "Cleanup completed successfully!" -ForegroundColor Green 