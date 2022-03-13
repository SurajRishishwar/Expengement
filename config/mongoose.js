const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://SurajSharma:Suraj%400303@socialmedia.7x8wt.mongodb.net/Expense?retryWrites=true&w=majority');
const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error"));
db.once('open',function(){
    console.log('connected');
});
module.exports = db;



// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/em_develop');

// const db = mongoose.connection;

// db.on('error',console.error.bind(console,'error connecting to db'));

// db.once('open',function(){
//     console.log('successfully  connected to db');
// });

// module.exports = db;