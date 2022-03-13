const express=require('express');
const passport = require('passport');
const Authenticate = require('../config/authentication');

const router = express.Router();
const user_controller=require('../controllers/user_controller');

router.get('/signin',user_controller.signin);
router.get('/signup',user_controller.signup);
router.get('/logout',user_controller.logout);
router.get('/contact',Authenticate,user_controller.contact);
router.post('/contactmsg',Authenticate,user_controller.contactmsg);
router.post('/createme',user_controller.createme);
router.post('/signinme',user_controller.signinme);
router.post('/deposit',Authenticate,user_controller.deposit);
router.post('/credit',Authenticate,user_controller.credit);
router.get('/details',Authenticate,user_controller.details);
router.get('/homeinside',Authenticate,user_controller.homeinside);
router.get('/profile',Authenticate,user_controller.profile);
router.get('/updateprofile',Authenticate,user_controller.updatepage);
router.post('/updatemy',Authenticate,user_controller.uptodate);
router.get('/verify/:accesstokenvalue',user_controller.verify);
router.get('/termsandconditions',user_controller.term);
//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin',session:false}),async (req,res)=>{
    let user=req.user;
    let token = await user.generateAuthToken();
    console.log(token);
    console.log('token saved in cookies and db');
    res.cookie("Expengement", token, {
        httpOnly: true,
        secure:false,
    
    });
    return res.redirect('/users/homeinside');
});

router.get('/forgetpassword',user_controller.forgetpage);
router.post('/forgetmypass',user_controller.forgetpass);
router.get('/updatepassword/:accesstokenvalue/:email',user_controller.updatepass);
router.post('/newpass',user_controller.newpass);

module.exports=router;