const mongoose = require('mongoose');
const contact = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    msg:{
        type:String,
        required:true
    },
    

}, {
    timestamps:true
});

const contactquery = mongoose.model('contactquery',contact);
module.exports = contactquery;