const mongoose = require('mongoose');
const { Schema } = mongoose;




const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
  
    points: {
        type: Number,
        default: 0
    },
    lives: {
        type: Number,
        default: 3
    },
      lastLifeLostAt: {
        type: Date,
        default: null
    }
});



const User = mongoose.model('User', UserSchema);


module.exports = {  User};