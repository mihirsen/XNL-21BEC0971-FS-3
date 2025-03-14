#!/bin/bash
# Smart City Application Status Check Script
# This script checks the status of all Kubernetes resources related to the Smart City application

echo -e "\e[32mChecking status of Smart City application deployment...\e[0m"

# Check if the namespace exists
if ! kubectl get namespace smartcity &> /dev/null; then
    echo -e "\e[31mThe smartcity namespace does not exist. The application may not be deployed.\e[0m"
    exit 1
fi

# Check pods status
echo -e "\e[33m\nPod Status:\e[0m"
kubectl get pods -n smartcity

# Check services status
echo -e "\e[33m\nService Status:\e[0m"
kubectl get services -n smartcity

# Check deployments status
echo -e "\e[33m\nDeployment Status:\e[0m"
kubectl get deployments -n smartcity

# Check ingress status
echo -e "\e[33m\nIngress Status:\e[0m"
kubectl get ingress -n smartcity

# Check persistent volume claims
echo -e "\e[33m\nPersistent Volume Claims:\e[0m"
kubectl get pvc -n smartcity

# Check for any issues with pods
echo -e "\e[33m\nChecking for pod issues...\e[0m"
NOT_RUNNING_PODS=$(kubectl get pods -n smartcity -o jsonpath='{.items[?(@.status.phase!="Running")].metadata.name}')
if [ -n "$NOT_RUNNING_PODS" ]; then
    echo -e "\e[31mThe following pods are not in Running state:\e[0m"
    for pod in $NOT_RUNNING_PODS; do
        echo -e "\e[31m- $pod\e[0m"
        echo -e "\e[33mPod details:\e[0m"
        kubectl describe pod $pod -n smartcity | grep -E "State:|Reason:|Message:|Last State:"
        echo -e "\e[33mRecent logs:\e[0m"
        kubectl logs $pod -n smartcity --tail=20 || echo "Cannot retrieve logs"
        echo ""
    done
else
    echo -e "\e[32mAll pods are running.\e[0m"
fi

# Check if the application is accessible
echo -e "\e[33m\nChecking application accessibility...\e[0m"
if ping -c 1 smartcity.local &> /dev/null; then
    echo -e "\e[32msmartcity.local is reachable.\e[0m"
    
    # Try to access the application
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://smartcity.local || echo "Failed")
    if [ "$HTTP_STATUS" == "200" ]; then
        echo -e "\e[32mApplication is accessible (HTTP 200 OK).\e[0m"
    else
        echo -e "\e[31mApplication returned HTTP status: $HTTP_STATUS\e[0m"
    fi
else
    echo -e "\e[31msmartcity.local is not reachable. Check your hosts file and network configuration.\e[0m"
    echo -e "\e[33mYour hosts file should contain an entry like: 127.0.0.1 smartcity.local\e[0m"
fi

echo -e "\e[32m\nStatus check completed.\e[0m" 