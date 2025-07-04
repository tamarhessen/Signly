const { User} = require('../models/user');
const jwt = require('jsonwebtoken');

async function generateToken(user) {
    const {username, password} = user
    console.log(username, password);
    const existingUser = await User.findOne({username: username, password: password});
    if (!existingUser) {
        return null;
    }
    const payload = {username: username};
    const secretKey = 'your-secret-key';

    return jwt.sign(payload, secretKey);
}
async function getLeaderboard(currentUserId) {
    const users = await User.find({}, 'displayName points _id profilePic');


    return users.map(user => ({
        username: user.displayName,
        points: user.points,
        pic: user.profilePic
    }));
}


async function registerUser(userData) {
    const {username} = userData;
    const existingUser = await User.findOne({username: username});
    if (existingUser) {
        return null;
    }

    const user = new User(userData);
    await user.save();
    return user;
}

async function getUserByUsername(username) {
    const user = await User.findOne({username: username}, 'username displayName profilePic ');
    return user || null;
}





async function deleteUserById(userId) {
    const user = await User.findOneAndRemove({username: userId})
    return user;
}

async function updateUserById(userId, newUsername, newImg, newDisplayName, newPassword) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('user doesn\'t exist');
        return null
    }
    if ((await User.findOne({username: newUsername}))) {
        console.log('couldn\'t change username stopping process');
        return null
    }
    if ((await User.findOne({displayName: newDisplayName}))) {
        console.log('couldn\'t change display name stopping process');
        return null
    }
    if (newUsername) {
        if (!(await User.findOne({username: newUsername}))) {
            let users = await User.find();
            await users.forEach(async (user) => {
                console.log(user);
                if (user !== userId) {
                    console.log(user);
                    await user.save();
                }
            })
            user.username = newUsername
        } else {
            console.log('couldn\'t change username stopping process');
            return null
        }
    }
    if (newImg) {

        user.profilePic = newImg;
    }
    if (newDisplayName) {
        if ((await User.findOne({displayName: newDisplayName}))) {
            console.log('couldn\'t change display name stopping process');
            return null
        }
        user.displayName = newDisplayName;
    }

    if (newPassword) {
        user.password = newPassword;
    }
    await user.save();
    return user;
}


async function updateUserPoints(userId, points) {
    try {
        const user = await User.findById(userId);  // Find user by ID
        if (!user) {
            throw new Error('User not found');
        }

        // Add points to the current total
        user.points += points;

        console.log('Updated points in DB:', user.points);  // Log the updated points

        // Save the updated user to the database
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating points');
    }
}
async function getUserPoints(userId) {
    const user = await User.findOne({ username: userId });
    if (!user) {
        console.log('couldn\'t find user');
        return null;
    }
    console.log("User Object:", user); // בדיקה כללית
    console.log("User Points:", user.points); // בדיקת השדה הספציפי
    return user.points;
}

async function loseLife(userId) {
    const user = await User.findOne({ username: userId });
    if (!user) throw new Error('User not found');
      
    const waitTimeMinutes = 1;
  
    if (user.lives > 0) {
      user.lives -= 1;
      if (user.lives === 0) {
        user.lastLifeLostAt = new Date();
      }
      await user.save();
      return { lives: user.lives, reset: false };
    } else {
      const now = new Date();
      const elapsedMinutes = (now - user.lastLifeLostAt) / (1000 * 60);
  
      if (elapsedMinutes >= waitTimeMinutes) {
        user.lives = 3;
        user.lastLifeLostAt = null;
        await user.save();
        return { lives: user.lives, reset: true };
      } else {
        throw {
          message: `You must wait ${Math.ceil(waitTimeMinutes - elapsedMinutes)} more minutes.`,
          lives: 0
        };
      }
    }
  }
  async function getLives(userId) {
    // Look up by username instead of ID
    const user = await User.findOne({ username: userId });
    if (!user) throw new Error('User not found');
  
    // Return just the number of lives to match what frontend expects
    return user.lives;
  }

  
  async function getTimeUntilNextLife(userId) {
    const user = await User.findOne({ username: userId });
    if (!user) throw new Error('User not found');
     
    const waitTimeMinutes = 1;
  
    // אם יש לו לבבות – אין צורך להמתין
    if (user.lives > 0 || !user.lastLifeLostAt) {
      return { waitTime: 0, lives: user.lives };
    }
  
    const now = new Date();
    const remainingSeconds = Math.max(0, waitTimeMinutes * 60 - (now - user.lastLifeLostAt) / 1000);

// אם הזמן עבר – מחזירים חיים
if (remainingSeconds <= 0) {
  user.lives = 3;
  user.lastLifeLostAt = null;
  await user.save();
  return { waitTime: 0, lives: 3 };
}

// אם עדיין לא עבר זמן – מחזירים זמן שנותר
return { waitTime: Math.ceil(remainingSeconds), lives: user.lives };

  }
  


module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
  
    deleteUserById,
    updateUserById,
    updateUserPoints,
    getUserPoints,
    getLeaderboard,
    loseLife,
    getLives,
    getTimeUntilNextLife
};