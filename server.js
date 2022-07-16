//imports
const path =require('path');
const express = require("express");
const socketio = require("socket.io");
const http =require("http");
// const mongoose = require('mongoose')
const formatMessage = require('./utils/MessageFormat');
const { UserJoin, GetUser, getRoomUsers, LeftUser}= require('./utils/GetUsers');
//creating express object
const app = express();

//converting the machine into an http server
const server = http.createServer(app)
const io = socketio(server)

let botName="ChatApp"
//Run when client connects
io.on("connection",socket=>{
    console.log("New socket connection")

    socket.on("joinRoom" , ({username,room})=>{

    const user= UserJoin(socket.id,username, room)
    
    //join the room

    socket.join(user.room)
    
    //Single user message displayed
    socket.emit("message",formatMessage(botName,"Welcome to ChatApp"))

    //New user message displayed to everyone except the user
    socket.broadcast.to(user.room).
    emit("message",formatMessage(botName,`${user.username} a new user has joined`))

  //Send room info

  io.to(user.room).emit("roomUsers",{
    room :user.room,
    users:getRoomUsers(user.room)
})    


})

  


    socket.on("chatMessage" , msg=>{
        console.log(msg)
        io.emit("message", formatMessage("User",msg))
    })

        //Runs when client disconnects
        socket.on('disconnect', ()=>{
            const user = LeftUser(socket.id)
            if(user)
            {
                io.to(user.room).
                emit("message", formatMessage(botName,`${user.username}  has left the chat`))
               
                //send user room info
                io.to(user.room).emit("roomUsers",{
                    room :user.room,
                    users:getRoomUsers(user.room)
                })
            }



            })
    

})





//set static folder so that we can use the public folder where we have forms

app.use(express.static(path.join(__dirname,'html_css')))





// mongoose.connect(`mongodb+srv://burhan:Ope1IlcF6irvZVsU@cluster0.hvz6i.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('database connected'))


//PORT number is set where the server will be running
const PORT= 5000|| process.env.PORT
server.listen(PORT,()=>console.log(`Server is started at ${PORT}`))