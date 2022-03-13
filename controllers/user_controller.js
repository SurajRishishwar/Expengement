const bcrypt=require('bcrypt');
const crypto=require('crypto');
const accesstoken=require('../models/verifiedtokens');
const forget=require('../models/forgettokens');
const jwt =require('jsonwebtoken');
const { redirect, append } = require('express/lib/response');
const users=require('../models/users');
const contact =require('../models/contact');
const transaction=require('../models/transaction');
const linkmail= require('../mailers/verifyuser');
const { aggregate } = require('../models/users');
const { profile } = require('console');


const saltr=3; 





module.exports.signin=function(req,res){
    if(req.cookies.Expengement){
        res.redirect('/users/homeinside');
    }
    else{
        return res.render('login',{
            title:"EM | Sign In",
            isAdded:''
    
        });
    }
    
}

module.exports.signup=function(req,res){
    if(req.cookies.Expengement){
        res.redirect('/users/homeinside');
    }
    else{
        return res.render('signup',{
            title:"EM | Sign Up",
            isAdded:''
        });
    }
}
module.exports.createme=async function(req,res){
  try{
        // console.log(req.body)
        
    
        let existuserd=await users.findOne({email:req.body.email,status:"Active"});
        if(existuserd){
            return res.render('signup',{
                title:"EM | Sign Up",
                isAdded:'Email Already Exist'
            });
        }
        let existuserp=await users.findOne({email:req.body.email,status:"Pending"});
        if(existuserp){
            let del=await users.findOneAndDelete({email:existuserp.email});
        }
        
        // let deleteuser=await users.findOneAndDelete({email:existuserp.email});
        let existuser=await users.findOne({email:req.body.email});
        let newuser;
        if(!existuser){
            let name=req.body.name;
            let capname=name.toUpperCase();
            let hashpass=await bcrypt.hash(req.body.password, saltr);
            newuser=await users.create({
                email:req.body.email,
                name:capname,
                phone:req.body.phone,
                worth:0,
                password:hashpass,
                status:"Pending"
            });
        }

        let setat;

        if(newuser){
            setat=await accesstoken.create({
                userid:newuser.id,
                accesstokenvalue:crypto.randomBytes(120).toString('hex'),
                isvalid:true
            });
        }
        setat=await accesstoken.findOne({userid:newuser.id});
        console.log(newuser.email);
        console.log(setat);
    

        
        linkmail.newuserverify(newuser.email,setat.accesstokenvalue,newuser.name);

        return res.render('calllink',{
            title:"EM | Thank You"
            //check your mail
        });
        
  }catch(err){
    console.log(err);
    return;
  }
}

module.exports.signinme=async function(req,res){
    


    try{
        let token;
        let requestedsuser=await users.findOne({email:req.body.email,status:"Active"});
        //console.log(requestedsuser);
        if(requestedsuser){
            let match=await bcrypt.compare(req.body.password,requestedsuser.password);
            if(match){
                
                //var token=jwt.sign({requestedsuser},'hithisismyemprojecttomakemyresumebig',{expiresIn: '35d'});
                token = await requestedsuser.generateAuthToken();
                // console.log(token);
                // console.log('token saved in cookies and db');
            
                res.cookie("Expengement", token, {
                    httpOnly: true,
                    secure:false,
                
                });
               
           
                return res.redirect('/users/homeinside');
            }else{
                return res.render('login',{
                    title:"EM | Sign In",
                    isAdded:'Wrong Password'
            
                });
            }
        }else{
            return res.render('login',{
                title:"EM | Sign In",
                isAdded:'Email Not Found'
        
            });
        }
 
    }catch(err){
        console.log('kya h',err);
    }
}

module.exports.verify=async function(req,res){
  try{
    const accesstokenvalue=req.params.accesstokenvalue;
    console.log('got the token',accesstokenvalue);
    let userstoken=await accesstoken.findOne({accesstokenvalue,isvalid:true});
    console.log('token mil gya',userstoken.userid);
    if(userstoken){
        let updatetoken = await accesstoken.findOneAndUpdate({userid:userstoken.userid},{isvalid:false});
        let updateactive= await users.findByIdAndUpdate(userstoken.userid,{status:"Active"});
        let updateuser= await users.findById(userstoken.userid);
        console.log('updated ',updateuser);
        let token = await updateuser.generateAuthToken();
        // console.log(token);
        // console.log('token saved in cookies and db');
        res.cookie("Expengement", token, {
            httpOnly: true,
            secure:false,
        });
        // here changes---------------------------------------------------------
        return res.redirect('/users/homeinside');
    }
  }catch(err){
      console.log(err);
  }
}

module.exports.forgetpage= function(req,res){
    return res.render('forget',{
        title:"EM | Forget Password",
        isAddedpass:""
    });
}

module.exports.forgetpass=async function(req,res){
    userexist=await users.findOne({email:req.body.email});
    if(userexist){
        tokenpass= await forget.create({
            email:req.body.email,
            accesstokenvalue:crypto.randomBytes(120).toString('hex'),
            isvalid:true
        });
        let forgetuser=await forget.findOne({email:req.body.email});
        console.log('user h',forgetuser);
        linkmail.forgetpass(req.body.email,forgetuser.accesstokenvalue);
        return res.render('calllink.ejs',{
            title:"EM | Thank You"
        });
    }
    else{
        return res.render('forget',{
            title:"Forget Password",
            isAddedpass:"Email not Found"
        });
    }

   
}
module.exports.updatepass=async function(req,res){
    try{
        const accesstokenvalue=req.params.accesstokenvalue;
        const email=req.params.email;

        console.log(email,'got the token',accesstokenvalue);
        let userstoken=await forget.findOne({accesstokenvalue,isvalid:true});
        // console.log('token mil gya',userstoken.email);
        if(userstoken){
            return res.render('passchange',{
                title:"Update Password",
                user:userstoken.email,
                error:""
            });
        }
       
        // if(userstoken){

        //     let updatetoken = await forget.findOneAndUpdate({email:userstoken.email},{isvalid:false});
        //     let update= await users.findByIdAndUpdate(userstoken.userid,{status:"Active"});
        //     let updateuser= await users.findById(userstoken.userid);
        //     console.log('updated ',updateuser);
          
        //     // here changes---------------------------------------------------------
        //     return res.redirect('/users/sign-in');
        // }
      }catch(err){
          console.log(err);
      }

}

module.exports.newpass=async function(req,res){
   
    let hashpass=await bcrypt.hash(req.body.password, saltr);
    
    let updated = await users.findOneAndUpdate({email:req.body.email,status:"Active"},{password:hashpass}); 
    let updatetoken = await forget.findOneAndUpdate({email:req.body.email},{isvalid:false});  
    if(updated){
        return res.render('login',{
            title:"EM | Sign In",
            isAdded:"Password Updated !!"
        })
    }

}

module.exports.homeinside=async function(req,res){
    let data=await transaction.find({depositer:req.user._id}).sort("-createdAt").limit(2);
    let tranno=data.length;

    return res.render('homeinside',{
        title:"EM | Home",
        userhistforhome:data,
        trancount:tranno,
        authenuser:req.user
    });
}

module.exports.contact= async function(req,res){
    
    return res.render('contact',{
        title:"EM | Contact",
        profile:req.user
    });
}
module.exports.contactmsg=async function(req,res){
    await contact.create({
        userid:req.body.userid,
        msg:req.body.msg
    });
    return res.redirect('/users/homeinside')
}

module.exports.deposit=function(req,res){
    let d=new Date();
    let textd=d.toDateString();
    let textt=d.toTimeString();
    let otime=textt.slice(0,8);
    transaction.create({
        depositer:req.user.id,
        amount:req.body.amount,
        trantype:true,
        remark:req.body.remark,
        date:textd,
        time:otime
    });
  
   
    let preworth;
    users.findById(req.user.id,function(err,predata){
        console.log(predata.worth);
        preworth=+predata.worth+ +req.body.amount;
        console.log(preworth);
        users.findByIdAndUpdate(req.user.id,{worth:preworth},function(err,uup){
            console.log('value updated');
        });
    });
    console.log('deposited!!!');
    return res.redirect('/users/homeinside');
}

module.exports.credit=function(req,res){
    let d=new Date();
    let textd=d.toDateString();
    let textt=d.toTimeString();
    let otime=textt.slice(0,8);
    transaction.create({
        depositer:req.user.id,
        amount:req.body.amount,
        trantype:false,
        remark:req.body.remark,
        date:textd,
        time:otime
    });
    let preworth;
    users.findById(req.user.id,function(err,predata){
        console.log(predata.worth);
        preworth=+predata.worth- +req.body.amount;
        console.log(preworth);
        users.findByIdAndUpdate(req.user.id,{worth:preworth},function(err,uup){
            console.log('value updated');
        });
    });
    console.log('credited!!!');
    return res.redirect('back');
}

module.exports.details=async function(req,res){
   try{
    let data=await transaction.find({depositer:req.user._id}).sort("-createdAt");
    
    let tranno=data.length;
   
    let detailsuser=await users.findById(req.user.id);
    return res.render('details',{
        title:"EM | History",
        userhistory:data,
        trancount:tranno,
        authenuser:detailsuser
    });
   }catch(err){
       console.log(err);
   }
}
module.exports.profile=async function(req,res){
    let data=await users.findById(req.user.id);
    return res.render('profile',{
        title:"EM | Profile",
        profile:data
    });
}
module.exports.updatepage=async function(req,res){
    let data=await users.findById(req.user.id);
    return res.render('profileupdate',{
        title:"EM | Update Profile",
        profile:data
    });
}
module.exports.uptodate=async function(req,res){
    let name=req.body.name;
    let capname=name.toUpperCase();
    let data=await users.findByIdAndUpdate(req.body.user,{
        name:capname,
        phone:req.body.phone
    });

    let datap=await users.findById(req.body.user);
    return res.render('profile',{
        title:"EM | Profile",
        profile:datap
    });
}
module.exports.logout=function(req,res){
    res.clearCookie("Expengement");
    return res.redirect('/');
}
module.exports.term=function(req,res){
    return res.render('privacy');
}