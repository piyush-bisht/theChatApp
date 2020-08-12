var rooms=[];

function createRoomList(room){
    var users=[];
    var newRoom={id:room,users:users};
    rooms.push(newRoom);
};


function insertUser(username,socketid,room){
    var userRoom=rooms.find(element=>element.id==room);
    for(i of userRoom.users){
        if(i.username==username)
        return;
    }
    userRoom.users.push({username:username,socketID:socketid});
}

function updateUser(socketID){
    for(i of rooms)
    {
        for(var j=0;j<i.users.length;j++){
            if(i.users[j].socketID==socketID){
                var user=i.users[j];
                i.users.splice(j,j+1);
                return(user.username);
            }
        }
    }
    
}

function showUsers(room){
    var userRoom=rooms.find(element=>element.id==room);
    return(userRoom.users);
}


module.exports={createRoomList,updateUser,insertUser,showUsers};