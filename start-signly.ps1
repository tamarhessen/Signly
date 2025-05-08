# run - /start-signly.ps1

# Start Flask (Python) in new window
$projectRoot = Get-Location
Start-Process powershell -ArgumentList '-NoExit', '-Command', "python -u `"$projectRoot\python\camera.py`""
# Start Node.js backend in new window
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd server; npm run server'

# Start React frontend in new window
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm start'


