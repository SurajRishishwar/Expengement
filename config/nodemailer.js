const path =require('path');
const nodemailer = require("nodemailer");
const ejs = require('ejs');


let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'sociademedia@gmail.com',
        pass:'Suraj@0303'
    }
});


let renderTemplate = (data,relativepath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,"../views/mailers",relativepath),
        data,
        function(err,template){
            if(err){
                console.log('Error in sending mail : ',err);
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}   