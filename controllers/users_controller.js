
const User = require('../models/user');

module.exports.profile = async function(req, res){
    return res.render('user_profile', {
        title: "User Profile"
    })
}

//Render the sign up Page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

//Render the Sign in Page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = async function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    let user = await User.findOne({email: req.body.email});
   
        /*function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }*/

        if(!user){
            User.create(req.body);
            console.log(req.body);
                /*function(err,user){
                
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }*/
                return res.redirect('/users/sign-in');
            }
        else{
            return res.redirect('back');
        }
}

//sign-in and create a session for user
module.exports.createSession = async function(req, res){
    //TodO Later
}


   