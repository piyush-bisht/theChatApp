var mongoose=require("mongoose");

var commentSchema=mongoose.Schema({
    text:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports=mongoose.model("comment",commentSchema);