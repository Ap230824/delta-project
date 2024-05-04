const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema =new mongoose.Schema(
    {
        email :{
            type: String,
            required : true
        },

    }
);
// here passportlocal-mongoose are automatically implement the username passeword it implement the slat value and hash code

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);