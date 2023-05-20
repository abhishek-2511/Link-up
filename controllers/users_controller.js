
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');


module.exports.profile = async function(req, res){
    
    try{
        let user = await User.findById(req.params.id);

        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    }
    catch(err){
        console.log('Error in Rendering the Profile');
    }
}

module.exports.update = async function(req,res){

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);    
    
            User.uploadedAvatar(req, res , function(err){
                
                if(err){
                    console.log("***Multer Error: ",err);
                }

                user.name = req.body.name;
                user.email = req.body.email;
                
                if(req.file){

                    if(user.avatar){

                        let currAvatarpath = path.join(__dirname, '..' , user.avatar);
                        
                        if(fs.existsSync(currAvatarpath)){
                            
                            fs.unlinkSync(currAvatarpath);
                        }
                        
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '\\' + req.file.filename;
                }
                user.save();
                //return res.redirect('back');  //this is giving error
            });
        }
        catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

        
        req.flash('success', 'Updated!');
        return res.redirect('back');
    }
    else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


//Render the sign up Page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

//Render the Sign in Page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = async function(req, res){

    try{
        if(req.body.password != req.body.confirm_password){
        
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }

        const user = await User.findOne({email: req.body.email});

        if(!user){
            const createdUser = await User.create(req.body);
            let job = await queue.create('signup-successful', createdUser).save();

            console.log('Job Enqueued : ', job.id);
            req.flash('success', 'Sign up completed');
            return res.redirect('/users/sign-in');
        }
        else{
            req.flash('error', 'Email Already exist');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('error in finding user in signing up');
        return;
    }
}

//sign-in and create a session for user
module.exports.createSession = async function(req, res){
    
    req.flash('success', 'Logged in Successfully');

    return res.redirect('/');
}

module.exports.destroySession = async function(req,res){
    req.logout(function(err){
        if(err){
            console.log('Error in log out');
        }
        req.flash('success', 'You have Logged Out!');
        return res.redirect('/');
    });
    
}

module.exports.resetPassword = function(req, res){
    
    return res.render('reset_password',{
        
        title: 'Link-up | Reset Password',
        access: false
    });
}

module.exports.resetPassMail = async function(req,res){

    try{
        const user = await User.findOne({email: req.body.email});

        if(user){
            if(!user.isTokenValid){

                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
            }

            let job = await queue.create('user-emails', user).save();

            req.flash('success', 'Password reset link sent. Please check your mail');
            return res.redirect('/');
            
        }
        else{
            req.flash('error', "User not findOneAndUpdate. Try again!");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in fiding user', err);
        return;
    }
}

module.exports.setPassword = async function(req, res){
    
    try{
        let user = await User.findOne({accessToken: req.params.accessToken});
    
        if(user.isTokenValid){
            
            return res.render('reset_password',
            {
                title: 'Link-up | Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else{
            req.flash('error', 'Link expired1');
            return res.redirect('/users/reset-password');
        }
    }
    catch(err){
        console.log('Error in finding user', err);
        return;
    }
}

module.exports.updatePassword = async function(req,res){

    try{
        let user = await User.findOne({accessToken: req.params.accessToken});
        
        if(user.isTokenValid){

            if(req.body.newPass == req.body.confirmPass){

                user.password = req.body.newPass;
                user.isTokenValid = false;
                await user.save();
                
                req.flash('success', 'Password updated. Login now!');
                return res.redirect('/users/sign-in');
            }
            else{
                req.flash('error', 'Password dont Match');
                return res.redirect('back');
            }
        }
        else{
            req.flash('error','Link Expired2');
            return res.redirect('/users/reset-password');
        }

    }
    catch(err){
        console.log('Error in finding user', err);
        return;
    }
}


   