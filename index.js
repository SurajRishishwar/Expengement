const express=require('express');
const cookieParser=require('cookie-parser');
const app = express();
const port= process.env.port || 8000;
const db=require('./config/mongoose');
const googlestt=require('./config/passport-google-oauth2-strategy');
const passport = require('passport');







app.use(express.urlencoded());
app.use(cookieParser());

app.set('view engine','ejs');
app.set('views','./views');


app.use(express.static('./assets'));

app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log('Error is :',err);
    }

    console.log(`server is up at: ${port}`);
});

