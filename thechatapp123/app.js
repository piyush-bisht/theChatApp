var express                                =require("express");
var socket                                 =require("socket.io");
var mongoose                               =require("mongoose");
require("dotenv").config();
var bodyParser                             =require("body-parser");
var passport                               =require("passport");
var localStrategy                          =require("passport-local");
var moment                                 =require("moment-timezone");

var User                                   =require("./models/userSchema");
var messages                               =require("./models/messageSchema")
var chats                                  =require("./models/chatSchema");

var app                                    =express();
var routes                                 =require("./routes/routes");

var userFunctions                          =require("./usersFunctions/users");
var flash                                  =require("connect-flash");

//chats.remove({},(err)=>{});
//messages.remove({},(err)=>{});
 //User.remove({},(err)=>{});

var url=process.env.DATABASEURL||"mongodb://localhost:27017/chatApp"; 
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});

app.use(require("express-session")({
    secret:"abc",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var user;
app.use((req,res,next)=>{
    user=req.user;
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

app.use(routes);
var server=app.listen(process.env.PORT||3000,()=>{
    console.log("server started");
})



//setting up socket
var io=socket(server);
io.on("connection",(socket)=>{
    socket.on("joinRoom",(room)=>{

        console.log("CONNECTION HAS BEEN EST");
        userFunctions.createRoomList(room);
        //Join the room
        socket.join(room);
        var users=userFunctions.showUsers(room);
        //Insert socket into userlist
        userFunctions.insertUser(user.firstName,socket.id,room);
        //emit the userlist to all sockets
        io.to(room).emit("userslist",users);
        
        //Creating a chat


        console.log(user+" connected");
        var msg="welcome "+user.firstName;
        socket.emit("welcome",{msg});
        msg=user.firstName+" has joined the chat";
        socket.broadcast.to(room).emit("welcome",{msg});
        

        //sending the list of logged in users to the client joined as well as other clients
        socket.to(room).emit("message",users);
        socket.broadcast.to(room).emit("message",users);
        
        //receiving message
        socket.on("chat",(data)=>{
             //console.log(data);
            
            var newmessage={
                    text:data.message,
                    sender:data.handle,
                    createdAt:moment().tz('Asia/Kolkata').format('h:mm a')
                };
                    //Saving the message to DB
                    var roomstring=room.toString();
                    console.log("room is :"+room);
                    //finding the room
                    chats.findOne({room:roomstring},(err,foundChat)=>{
                        console.log("foundChat= "+foundChat);

                        messages.create(newmessage,(err,newmessage)=>{
                            //console.log(newmessage);

                            foundChat.messages.push(newmessage._id);
                            foundChat.save();
                            io.to(room).emit("chat",newmessage); //sending data to all sockets
                        }) 
                    })
                      
            });
    
            socket.on("typing",(data)=>{
                
                socket.broadcast.to(room).emit("typing",data);
            })
    
            
        //Disconnecting user
        socket.on("disconnect",()=>{
            //console.log(updateUser(socket.id)+"has disc");
            io.to(room).emit("this",{users:users,userLeft:userFunctions.updateUser(socket.id)});
            
        })
    })
})

