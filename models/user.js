const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

//Passport local mongoose add username and passport like hash and salt


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);
//To use plugin for add  username  password  hashing and salting

module.exports = mongoose.model('User', userSchema);