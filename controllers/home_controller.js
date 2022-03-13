module.exports.home=function(req,res){
    if(req.cookies.Expengement){
        res.redirect('/users/homeinside');
    }
    else{
        return res.render('home',{
            title:"EM | HOME",
            
        });
    }
}