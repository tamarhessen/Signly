# Start Flask (Python) server
#Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd python && python camera.py"

# Start Node.js backend (server/)
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd server && npm run server"

# Start React frontend (main directory)
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm start"
