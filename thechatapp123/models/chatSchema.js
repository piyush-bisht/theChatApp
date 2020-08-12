var mongoose=require("mongoose");

var chatSchema=mongoose.Schema({
    room:String,
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message"
        }]
    
    
})

module.exports=mongoose.model("chat",chatSchema);