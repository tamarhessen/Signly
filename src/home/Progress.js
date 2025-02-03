import React, { useState } from 'react';
import MainScreen from './MainScreen';  // Import MainScreen

function App() {
  const [progress, setProgress] = useState(0);  // Track progress (0-100%)

  // Function to simulate progress update (e.g., after completing a task)
  const updateProgress = (newProgress) => {
    if (newProgress <= 100) {
      setProgress(newProgress); // Update the progress
    }
  };

  return (
    <div className="app-container">
      <MainScreen
        username="JohnDoe"
        displayName="John"
        progress={progress}
        updateProgress={updateProgress} // Pass the function to update progress
      />
    </div>
  );
}

export default App;
