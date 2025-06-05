# Signly

## Overview

**Signly** is the front-end web application for learning and practicing sign language interactively. The platform aims to make sign language education accessible and engaging for everyone. Users can sign in, progress through lessons, and receive instant feedback on their signing accuracy using camera recognition technology. 

### Authors

- Tamar Hessen
- Sapir Yanai

---

## Features

- **Interactive Lessons:** Practice sign language by performing gestures in front of your camera. The app provides instant feedback and tracks your progress.
- **Gamification:** Earn points, level up, and track your achievements as you complete lessons and quizzes.
- **User Management:** Sign up, log in, and manage your profile, including display name and profile picture.
- **FAQ and About:** Access helpful resources and details about the platform.

---

## Getting Started

### Manual Installation & Startup

If you prefer to run everything manually (instead of using the script), you must start three services in separate terminals/windows:

> **Note:** Make sure you have installed all dependencies first:  
> - For Python: `pip install -r requirements.txt` (or as required)  
> - For Node.js back end and front end: Run `npm install` in both `/server` and root directories as needed.

#### 1. Start the Camera/Flask Server (Python)
From the project root:
```bash
python -u python/camera.py
```

#### 2. Start the Node.js Backend
From the project root:
```bash
cd server
npm run windows
```

#### 3. Start the React Frontend
From the project root:
```bash
npm start
```

The application will run in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


---

## Code Structure

- **App.js:** The main entry point. Routes users based on authentication and the current path.
- **Login.js:** Handles the login screen and navigation to sign-up.
- **Signup.js:** Contains logic for user registration, including validation rules:
  - Username must be unique.
  - Password must be at least 8 characters and confirmed.
  - No limits on display name or profile picture.
- **Users.js:** Stores and manages user data, including checks for login and signup.
- **App/Login/signup.css:** Controls the visual styling for app, login, and signup pages.
- **src/home/MainScreen.js:** The main hub after login, showing user stats, lessons, fun facts, and navigation links.
- **src/home/RightPanel.js:** Shows user lives, points, and cooldown timers.
- **src/FAQ.js:** Frequently Asked Questions component.
- **src/About.js:** Platform introduction and feature explanations.
- **src/lessons/Lesson3.js:** Example lesson logic, including points and lives management.

---

## Example Workflow

1. **Sign Up:** Create a new account with a unique username and secure password.
2. **Log In:** Access your personalized learning dashboard.
3. **Start Lessons:** Practice signs using your camera and receive feedback.
4. **Level Up:** Earn points, advance levels, and unlock achievements.
5. **View Progress:** Check your stats, lives, and next goals in the dashboard.

---

## Contact

Have questions or suggestions? See the FAQ or open an issue!
