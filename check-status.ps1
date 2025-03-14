# Smart City Application Status Check Script for Windows
# This script checks the status of all Kubernetes resources related to the Smart City application

Write-Host "Checking status of Smart City application deployment..." -ForegroundColor Green

# Check if the namespace exists
$namespaceExists = kubectl get namespace smartcity 2>$null
if (-not $namespaceExists) {
    Write-Host "The smartcity namespace does not exist. The application may not be deployed." -ForegroundColor Red
    exit 1
}

# Check pods status
Write-Host "`nPod Status:" -ForegroundColor Yellow
kubectl get pods -n smartcity

# Check services status
Write-Host "`nService Status:" -ForegroundColor Yellow
kubectl get services -n smartcity

# Check deployments status
Write-Host "`nDeployment Status:" -ForegroundColor Yellow
kubectl get deployments -n smartcity

# Check ingress status
Write-Host "`nIngress Status:" -ForegroundColor Yellow
kubectl get ingress -n smartcity

# Check persistent volume claims
Write-Host "`nPersistent Volume Claims:" -ForegroundColor Yellow
kubectl get pvc -n smartcity

# Check for any issues with pods
Write-Host "`nChecking for pod issues..." -ForegroundColor Yellow
$notRunningPods = kubectl get pods -n smartcity -o jsonpath='{.items[?(@.status.phase!="Running")].metadata.name}'
if ($notRunningPods) {
    Write-Host "The following pods are not in Running state:" -ForegroundColor Red
    $notRunningPods -split ' ' | ForEach-Object {
        $pod = $_
        if ($pod) {
            Write-Host "- $pod" -ForegroundColor Red
            Write-Host "Pod details:" -ForegroundColor Yellow
            kubectl describe pod $pod -n smartcity | Select-String -Pattern "State:|Reason:|Message:|Last State:"
            Write-Host "Recent logs:" -ForegroundColor Yellow
            try {
                kubectl logs $pod -n smartcity --tail=20
            } catch {
                Write-Host "Cannot retrieve logs"
            }
            Write-Host ""
        }
    }
} else {
    Write-Host "All pods are running." -ForegroundColor Green
}

# Check if the application is accessible
Write-Host "`nChecking application accessibility..." -ForegroundColor Yellow
$pingResult = Test-Connection -ComputerName smartcity.local -Count 1 -Quiet
if ($pingResult) {
    Write-Host "smartcity.local is reachable." -ForegroundColor Green
    
    # Try to access the application
    try {
        $response = Invoke-WebRequest -Uri "http://smartcity.local" -UseBasicParsing -ErrorAction SilentlyContinue
        $httpStatus = $response.StatusCode
        if ($httpStatus -eq 200) {
            Write-Host "Application is accessible (HTTP 200 OK)." -ForegroundColor Green
        } else {
            Write-Host "Application returned HTTP status: $httpStatus" -ForegroundColor Red
        }
    } catch {
        Write-Host "Failed to connect to the application: $_" -ForegroundColor Red
    }
} else {
    Write-Host "smartcity.local is not reachable. Check your hosts file and network configuration." -ForegroundColor Red
    Write-Host "Your hosts file should contain an entry like: 127.0.0.1 smartcity.local" -ForegroundColor Yellow
}

Write-Host "`nStatus check completed." -ForegroundColor Green 