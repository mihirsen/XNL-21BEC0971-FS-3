# Setup Script for Local Kubernetes Development (Windows)
# This script sets up a local Kubernetes environment for testing the Smart City application

Write-Host "Setting up local Kubernetes environment for Smart City application..." -ForegroundColor Green

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker before continuing." -ForegroundColor Red
    exit 1
}

# Check if Kubernetes is enabled in Docker Desktop
Write-Host "Checking if Kubernetes is enabled in Docker Desktop..." -ForegroundColor Yellow
try {
    $null = kubectl version
    Write-Host "Kubernetes is running!" -ForegroundColor Green
} catch {
    Write-Host "Kubernetes is not enabled. Please enable Kubernetes in Docker Desktop or install minikube." -ForegroundColor Red
    Write-Host "For Docker Desktop: Settings > Kubernetes > Enable Kubernetes" -ForegroundColor Yellow
    Write-Host "For minikube: https://minikube.sigs.k8s.io/docs/start/" -ForegroundColor Yellow
    exit 1
}

# Install Ingress Controller if not already installed
Write-Host "Setting up Ingress Controller..." -ForegroundColor Yellow
try {
    $null = kubectl get ns ingress-nginx
    Write-Host "Ingress Controller already installed." -ForegroundColor Green
} catch {
    Write-Host "Installing Nginx Ingress Controller..." -ForegroundColor Yellow
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
    
    # Wait for the ingress controller to be ready
    Write-Host "Waiting for Ingress Controller to be ready..." -ForegroundColor Yellow
    kubectl wait --namespace ingress-nginx `
      --for=condition=ready pod `
      --selector=app.kubernetes.io/component=controller `
      --timeout=120s
}

# Add hosts entry for smartcity.local
Write-Host "Checking hosts file for smartcity.local entry..." -ForegroundColor Yellow
$hostsFile = "$env:windir\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsFile -Raw

if ($hostsContent -match "smartcity.local") {
    Write-Host "Host entry already exists for smartcity.local" -ForegroundColor Green
} else {
    Write-Host "Adding smartcity.local to hosts file (requires admin rights)..." -ForegroundColor Yellow
    # This operation requires administrator privileges
    $hostEntry = "`n127.0.0.1 smartcity.local"
    
    try {
        Add-Content -Path $hostsFile -Value $hostEntry -ErrorAction Stop
        Write-Host "Added smartcity.local to hosts file." -ForegroundColor Green
    } catch {
        Write-Host "Failed to update hosts file. Please run this script as Administrator or manually add this entry to your hosts file:" -ForegroundColor Red
        Write-Host "127.0.0.1 smartcity.local" -ForegroundColor Yellow
    }
}

# Create necessary namespaces
Write-Host "Creating Kubernetes namespace..." -ForegroundColor Yellow
kubectl create namespace smartcity --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Local Kubernetes environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Build your Docker images: ./deploy.ps1" -ForegroundColor Cyan
Write-Host "2. Access the application at http://smartcity.local once deployed" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy developing!" -ForegroundColor Green 