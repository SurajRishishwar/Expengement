const jwt = require('jsonwebtoken');
const user = require("../models/users");



const Authenticate = async (req,res,next) => {
    try {
        const token = req.cookies.Expengement
        // console.log(token)
        const verifyToken = jwt.verify(token,'hithisismyemprojecttomakemyresumebig');
        // console.log(verifyToken);
        const rootUser = await user.findOne({id:verifyToken.id, "tokens.token": token});

        if(!rootUser){
            return res.render('login',{
                title:"Sign In | Flub Waste"
            });
        }else{
            req.token = token;
            //req.rootUser = rootUser;
            req.user = rootUser;
            next();
        }
        
       
      

    }catch (err) {
        console.log(err);
        return res.render('login',{
            title:"EM | Sign In",
            isAdded:'Login is Required'
    
        });
   
        
        
    }

}

module.exports = Authenticate;