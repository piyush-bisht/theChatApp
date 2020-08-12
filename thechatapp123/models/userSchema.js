var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String

});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);