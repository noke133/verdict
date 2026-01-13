Write-Host "`n🧪 Testing Verdict API Endpoints...`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Write-Host "✅ Status: $($health.status)" -ForegroundColor Green
Write-Host "   Database: $($health.database)" -ForegroundColor Cyan

Write-Host "`n---`n"

# Test 2: Signup
Write-Host "2. Testing Signup..." -ForegroundColor Yellow
$signupBody = @{
    name = "Test Attorney"
    email = "attorney@test.com"
    password = "test123"
    role = "attorney"
}

try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method Post -Body ($signupBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Signup successful!" -ForegroundColor Green
    Write-Host "   User ID: $($signup.data.userId)" -ForegroundColor Cyan
    Write-Host "   OTP: $($signup.data.otp)" -ForegroundColor Yellow
    $global:testOtp = $signup.data.otp
    $global:testEmail = $signup.data.email
} catch {
    Write-Host "⚠️  Note: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n---`n"

# Test 3: Get Attorneys
Write-Host "3. Testing Get Attorneys..." -ForegroundColor Yellow
$attorneys = Invoke-RestMethod -Uri "$baseUrl/api/attorneys" -Method Get
Write-Host "✅ Found $($attorneys.data.attorneys.Count) attorneys" -ForegroundColor Green

Write-Host "`n✅ Core endpoints working!`n" -ForegroundColor Green
