const mongoose=require('mongoose');

const users = new mongoose.Schema({
    username:{
        type:String,
        required:(true,'Username cannot be empty')
    },
    Password:{
        type:String,
        required:(true,'Password cannot be empty')
    },
});
module.exports=mongoose.model('User',users);