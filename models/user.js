const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars'); 

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default:'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ],
    accessToken: {
        type: String,
        default: 'abc'
    },
    isTokenValid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function(req, file , cb){
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// static methods
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User',userSchema);

module.exports = User;