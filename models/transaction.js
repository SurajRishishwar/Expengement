const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    depositer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    trantype:{
        type:Boolean
    },
    remark:{
        type:String,
        required:true
    },
    date:{
        type:String
    },
    time:{
        type:String
    },

},{
    timestamps:true

});

const transaction= mongoose.model('transaction',transactionSchema);
module.exports=transaction;