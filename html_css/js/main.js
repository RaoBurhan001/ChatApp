//Access the form thorugh id 
const chatFom = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName= document.getElementById('room-name');
const Users = document.getElementById("users");

//Get the values from the query selector

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

console.log("Username" , username,room)

//The connection is established here 
const socket = io()

//Join Room

socket.emit('joinRoom', {username,room})

socket.on('message',message=>{
    console.log(message)
    outputMessage(message)
    
    //Scroll Down
    chatMessages.scrollTop= chatMessages.scrollHeight;
})

//Get Room info

socket.on("roomUsers",({users,room})=>{
    outputRooms(room)
    outputUsers(users)
})

//Message submit 

chatFom.addEventListener("submit",(e)=>{

    e.preventDefault()
    //getting value
    const msg= e.target.elements.msg.value;

    //Emit message to server
    socket.emit("chatMessage", msg)

    //Empty the text bar and focus on it 

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();



})

const outputMessage=(message)=>{
const div =  document.createElement('div')
div.classList.add('message');
div.innerHTML=`	<p class="meta">${message.username} <span>${message.time}</span></p>
<p class="text">
   ${message.text}
</p>`;
//append into the chat-message class

document.querySelector('.chat-messages').appendChild(div);

}

const outputRooms=(room)=>{
roomName.innerText= room;
}

const outputUsers=(users)=>{
    Users.innerText=` ${users.map(user=>` ${user.username}`).join('')}`
}