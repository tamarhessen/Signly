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
    }
});


const CommentSchema = new Schema({
    id: {
        type: Number,
        integer: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    creator:{
        type:String,
        required:true
    },
    creatorImg: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const PostSchema = new Schema({
    id: {
        type: Number,
        integer: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    Creator: {
        type:String,
        required:true
    },
    CreatorImg: {
        type: String,
        required: true
    },
    Comments: [{
        type: CommentSchema,
        nullable: true
    }],
    PostImg:{
        type: String,
        nullable:true
    },
    PostText:{
        type:String,
        nullable:true
    },
    PostLikes:{
        type: Number,
        integer: true
    },
    PeopleLiked: [{
        type:String,
        nullable: true
    }]
});



const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const User = mongoose.model('User', UserSchema);
const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = { Post, Comment, User, Friends };