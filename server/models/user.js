const mongoose = require('mongoose');
const { Schema } = mongoose;



const FriendsSchema = new Schema({
    FriendList: [{
        type: String,
        nullable: true
    }],
    PendingList: [{
        type:String,
        nullable: true
    }]
});

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
    friends: {
        type: FriendsSchema,
        nullable: true
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
const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = {  User, Friends };