let users = [];

export const registerUser = (userData) => {
  users.push(userData);
};

export const authenticateUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};


export const isUsernameEqual = (username) => {
  return users.some(user => user.username === username);
};
export const getDisplayName = (username) => {
  const userData = users.find(user => user.username === username);
  return userData.displayName;
};

export const getProfilePicture = (username) => {
  const userData = users.find(user => user.username === username);
  return userData.profilePicture;
};
export const getUserDataByUsername = (username) => {
  return users.find(user => user.username === username);
};


// Define the function to retrieve authenticated user data
export const getAuthenticatedUserData = (username) => {
  // Retrieve user data by username
  const userData = getUserDataByUsername(username);
  
  // Return user data if found
  if (userData) {
    return userData;
  } else {
    // Handle case where user data is not found (optional)
    return null;
  }
};
