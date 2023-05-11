
const User = require('../models/user');

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

        let user = await User.findByIdAndUpdate(req.params.id, req.body);
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
    if(req.body.password != req.body.confirm_password){
        
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    let user = await User.findOne({email: req.body.email});

        if(!user){
            User.create(req.body);
            console.log(req.body);
            
            req.flash('success', 'You have signed up, Sign-in to continue!');
            return res.redirect('/users/sign-in');
        }
        else{
            
            return res.redirect('back');
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


   