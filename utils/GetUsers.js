
let users=[];

const UserJoin=(id,username,room)=>{
    const user = {id,username,room}

    users.push(user);
    return user
}

const GetUser=(id)=>users.find(user=>user.id === id)


const LeftUser=(id)=>{

    const index= users.findIndex(user=> user.id === id)

    if(index !==-1)
    {
        return users.splice(index,1)[0]
    }
}


const getRoomUsers=(room)=> users.filter(user=>user.room === room)

module.exports={
    UserJoin,
    GetUser,
    LeftUser,
    getRoomUsers
}