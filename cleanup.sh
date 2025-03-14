#!/bin/bash
# Smart City Application Cleanup Script
# This script removes all Kubernetes resources related to the Smart City application

echo -e "\e[33mStarting cleanup process for Smart City application...\e[0m"

# Confirm with the user
read -p "This will delete all Smart City application resources from the Kubernetes cluster. Continue? (y/n): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo -e "\e[31mCleanup aborted.\e[0m"
    exit 1
fi

# Delete all resources in the smartcity namespace
echo -e "\e[33mDeleting all resources in the smartcity namespace...\e[0m"
kubectl delete namespace smartcity

# Check if the namespace was deleted
if kubectl get namespace smartcity &> /dev/null; then
    echo -e "\e[31mFailed to delete namespace. Trying to delete resources individually...\e[0m"
    
    # Delete resources individually
    echo -e "\e[33mDeleting ingress...\e[0m"
    kubectl delete -f k8s/ingress.yaml -n smartcity --ignore-not-found
    
    echo -e "\e[33mDeleting frontend deployment...\e[0m"
    kubectl delete -f k8s/frontend-deployment.yaml -n smartcity --ignore-not-found
    
    echo -e "\e[33mDeleting backend deployment...\e[0m"
    kubectl delete -f k8s/backend-deployment.yaml -n smartcity --ignore-not-found
    
    echo -e "\e[33mDeleting Redis deployment...\e[0m"
    kubectl delete -f k8s/redis-deployment.yaml -n smartcity --ignore-not-found
    
    echo -e "\e[33mDeleting MongoDB deployment...\e[0m"
    kubectl delete -f k8s/mongodb-deployment.yaml -n smartcity --ignore-not-found
    
    echo -e "\e[33mDeleting secrets...\e[0m"
    kubectl delete -f k8s/secrets.yaml -n smartcity --ignore-not-found
    
    # Try to delete the namespace again
    kubectl delete namespace smartcity --ignore-not-found
else
    echo -e "\e[32mNamespace deleted successfully.\e[0m"
fi

# Optional: Remove Docker images
read -p "Do you want to remove the Docker images as well? (y/n): " remove_images
if [[ $remove_images == "y" || $remove_images == "Y" ]]; then
    echo -e "\e[33mRemoving Docker images...\e[0m"
    docker rmi smart-city/frontend:latest smart-city/backend:latest || true
    echo -e "\e[32mDocker images removed.\e[0m"
fi

echo -e "\e[32mCleanup completed successfully!\e[0m" 