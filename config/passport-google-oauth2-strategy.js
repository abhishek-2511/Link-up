const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({

        clientID: '229373572200-3h0uthfh8vtvea6uv85scoeud9mgfst8.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8000/users/auth/google/callback',
    },
    async function(accessToken, refreshToken, profile, done){

        try{
            //find a user
            let user = await User.findOne({email: profile.emails[0].value}).exec();

            console.log(profile);

            if(user){
                //if found set this user as req.user
                return done(null, user);
            }
            else{
                //if not found, create the user and set it as req.user
                let newUser = await User.create({
                    
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, newUser);
            }
        }
        catch(err){
            console.log('error in google Strategy Passport', err);
            return;
        }
    }
));


module.exports = passport;