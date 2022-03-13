const passport=require('passport');
const jwt = require('jsonwebtoken');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const users = require("../models/users");
const { append } = require('express/lib/response');
const { nextTick } = require('process');

passport.use(new googleStrategy({
    clientID:"1006775842100-psdgdunpd38utje0icbr29qibg17h59q.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"https://expengement.herokuapp.com/users/auth/google/callback",
},function(accesstoken,refreshtoken,profile,done){
    users.findOne({email:profile.emails[0].value}).exec(async function(err,user){
        try{
            if(user){
            //     let token = await user.generateAuthToken();
            //     console.log(token);
            //     console.log('token saved in cookies and db');
         
            //    return token;
                    return done(null,user);

            }else{
                let name=profile.displayName;
                let capname=name.toUpperCase();
                let user=await users.create({
                    name:capname,
                    email:profile.emails[0].value,
                    worth:0,
                    phone:"N/A",
                    status:"Active",
                    password:crypto.randomBytes(20).toString('hex')
                });
              
                    // let token = await user.generateAuthToken();
                    // console.log(token);
                    // console.log('token saved in cookies and db');
                    // return token;
                    return done(null,user);
                    
            }

        }catch(err){
            if(err){
                console.log('error in google sign up',err);
                return;
            }
        }
        
    });
}));

module.exports=passport;
