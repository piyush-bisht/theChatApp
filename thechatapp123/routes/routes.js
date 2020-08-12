var express                                =require("express");
var router                                 =express.Router();
var passport                               =require("passport");
var localStrategy                          =require("passport-local");
var moment                                 =require("moment");
var mongoose                               =require("mongoose");
var bodyParser                             =require("body-parser");


var User                                   =require("../models/userSchema");
var messages                               =require("../models/messageSchema")
var chats                                  =require("../models/chatSchema");
var comments                               =require("../models/commentSchema");

//comments.remove({},(err)=>{});
router.get("/",(req,res)=>{
    res.render("landing");
})

//HOMEPAGE ROUTES
router.get("/chat",(req,res)=>{
    comments.find({}).populate("user").exec((err,comments)=>{
        if(err){
            console.log("no comments");
        }
        else{
        console.log("comments are"+comments);
         res.render("home",{comments:comments});
        }
    })
})

router.post("/chat",isLoggedIn,(req,res)=>{
    var comment={text:req.body.comment};
    comments.create(comment,(err,newComment)=>{
        if(err){
            req.flash("error","Some error in creating that comment");
        }
        else{
            
            var id=req.user._id;
            console.log("id is: "+id);
            User.findById(id,(err,foundUser)=>{
                if(err){
                    console.log("cant find user");
                }
                else{
                    
                    newComment.user=foundUser._id;
                    newComment.save();
                    req.flash("success","Thank you for your feedback.")
                    res.redirect("/chat")
                }
            })
        }
    })
    
})

router.get("/login",(req,res)=>{
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/chat",
    failureFlash:true,
    failureRedirect:"/login"
}),(req,res)=>{

})


router.get("/register",(req,res)=>{
    res.render("register");
})

router.get("/chat/:id",(req,res)=>{

    User.find({},(err,users)=>{
        if(!err){
            User.findById(req.params.id,(err,foundUser)=>{
                res.render("profile",{user:foundUser,users:users});
            })
            
        }
    })
    
})



router.post("/register",(req,res)=>{
    var user={username:req.body.username,firstName:req.body.firstName,lastName:req.body.lastName};
    User.register(user,req.body.password,(err,newUser)=>{
        if(err){
            console.log("error in user creation");
            req.flash("error","Some Error Occurred");
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                
            console.log("user registered");
            req.flash("success","Successfully Signed In")
            res.redirect("/chat/"+newUser._id);

            })

            
        }
    })

})
// router.get("/new",isLoggedIn,(req,res)=>{
//     messages.find({},(err,message)=>{
//         if(!err){
//         //console.log(message);
//        // console.log(message.sender);
//        // res.render("index",{message:message});
//         }
//     })

// })

router.post("/new",(req,res)=>{
    
    var room=req.body.room;
    var roomString=room.toString();
    console.log(req.body);
    console.log("Room is: "+room);
    
    //find if a room exists
    chats.findOne({room:roomString}).populate("messages").exec((err,foundChat)=>{
        if(!err)
        {
            console.log("CHAT DATA IS:  "+foundChat);
            if(foundChat)
            {
                console.log("found");
                console.log("foundchat messages: "+foundChat.messages);
                
                res.render("index",{message:foundChat.messages,room:room});
            }
            else
            {console.log("not found");
            
            //if chat not found, creates a new chat window
            chats.create({room:req.body.room},(err,newChat)=>{
                if(!err){
                    
                        if(!err){
                        console.log("NEW CHAT MESSAGES: "+newChat.messages);
                        res.render("index",{message:newChat.messages,room:room});
                        }
                    
                }
            })
        




            }
                
        }
        
        
    })
    
    
})

router.get("/logout",isLoggedIn,(req,res)=>{
    req.logout();
    req.flash("success","Sucessfully Logged Out");
    res.redirect("/chat");
})


//MIDDLEWARE
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("error","You must LogIn first")
        res.redirect("/login");
    }
}

module.exports=router;