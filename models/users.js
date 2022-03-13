const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true
    },
    worth:{
        type:Number,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
     },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
  
},{timestamps:true});



userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, 'hithisismyemprojecttomakemyresumebig');
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}



const user = mongoose.model('user',userSchema);
module.exports = user;