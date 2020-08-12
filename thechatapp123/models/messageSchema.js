var mongoose=require("mongoose");


var messageSchema=mongoose.Schema({

    text:String,
    sender:String,
    createdAt:String
});

module.exports=mongoose.model("message",messageSchema);