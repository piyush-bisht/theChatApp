
var socket=io.connect();

//Query DOM
var message=document.getElementById("message");
var handle=document.getElementById("handle");
var btn=document.getElementById("send");
var output=document.getElementById("output");
var feedback=document.getElementById("feedback");
var logout=document.getElementById("logout");
var list=document.getElementById("list");
var room=document.getElementById("Room").value;

function showUsers(users){
  list.innerHTML="";
  for(i of users){
    list.innerHTML+="<li class='list-group-item'>"+i.username+"</li>"

  }
}

//Emit event
socket.emit("joinRoom",room);

btn.addEventListener("click",()=>{
    //sending message
    socket.emit("chat",{
        message:message.value,
        handle:handle.value
    });
    message.value="";
    
})


setTimeout
message.addEventListener("click",()=>{
   // console.log(handle.value+"is typing");
    
      console.log(this.value);
      socket.emit("typing",{
        handle:handle.value
      })
    
  
})




//Listen to events

//userlist data receive
socket.on("userslist",(users)=>{
  showUsers(users);
})

//welcome data receive
socket.on("welcome",(message)=>{
  
  
  console.log(message.msg);
  
  feedback.innerHTML="<p><em>"+message.msg+"</em></p>";
  
})

socket.on("message",(users)=>{
  
  showUsers(users);
  output.scrollTop=output.scrollHeight;
})

var show=false;
socket.on("chat",(data)=>{
    console.log(data);
    feedback.innerHTML="";
    if(output.lastElementChild.lastElementChild.lastElementChild){
      
      if(output.lastChild.lastChild.lastChild.innerText==" is typing...")
      {output.lastChild.remove();
      output.innerHTML+="<div class=' messagebox' ><p ><span id='sendername'>"+data.sender+"</span>:<em>"+data.createdAt+"</em></p><p id='text'>" + data.text + "</p>";
      }
      else{
        output.innerHTML+="<div class=' messagebox' ><p ><span id='sendername'>"+data.sender+"</span>:<em>"+data.createdAt+"</em></p><p id='text'>" + data.text + "</p>";

      }
      

    }
    else{
      output.innerHTML+="<div class=' messagebox' ><p ><span id='sendername'>"+data.sender+"</span>:<em>"+data.createdAt+"</em></p><p id='text'>" + data.text + "</p>";


    }

    //Scroll automatic
    output.scrollTop=output.scrollHeight;
    show=false;
})

socket.on("typing",(data)=>{
  feedback.innerHTML="";
    console.log("received"+data.handle+"is typing");
    if(show){
    output.lastChild.innerHTML="<p ><span id='sendername'>"+data.handle+"</span><em>"+" is typing..."+"</em></p>";
    output.scrollTop=output.scrollHeight;
    
  }
    else{
      output.innerHTML+="<div class=' messagebox' ><p ><span id='sendername'>"+data.handle+"</span><em>"+" is typing..."+"</em></p></div>";
      output.scrollTop=output.scrollHeight;
      show=true;

    }
    //feedback.innerHTML="<p id='status'><em>"+data.handle+" is typing..."+"</em></p>";
})

socket.on("this",(userdata)=>{
  showUsers(userdata.users);
  
  feedback.innerHTML="<p>"+userdata.userLeft+" has left the chat"+"</p>";
})