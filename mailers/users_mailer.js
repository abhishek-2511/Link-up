
const nodemailer = require('../config/nodemailer');
// const nodemailer = require("nodemailer")


exports.resetPassword = (user) => {

    let htmlString = nodemailer.renderTemplate({ user: user }, '/users/password_reset.ejs');
    console.log('Inside resetPassword Mailer');

    nodemailer.transporter.sendMail({

        from: 'abhi1911singh2511@gmail.com',
        to: user.email,
        subject: 'Reset your Password',
        html: htmlString
    },
        (err, info) => {

            if (err) {
                console.log('Error in Sending Reset Mail', err);

                return;
            }
            console.log("info" + info,
                "errors: ", err);
            return;
        });
}


exports.signupSuccess = (user) => {

    let htmlString = nodemailer.renderTemplate({ user: user }, '/users/signup_successful.ejs');
    console.log('Inside signup Successful Mailer');

    nodemailer.transporter.sendMail({

        from: 'abhi1911singh2511@gmail.com',
        to: user.email,
        subject: 'Welcome to Link-up!',
        html: htmlString
    },
        (err, info) => {

            if (err) {
                console.log('Error in Sending Signup Mail', err);
                return;
            }
            return;
        });
}