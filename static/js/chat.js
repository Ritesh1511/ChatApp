 const socket = io();//sd
  //socket.emit('new-user-joined', user.name);
  //socket.emit('new-user-joined', user.name);       
 
  socket.emit('new-user-joined', user.name);


let message_container = document.querySelector('#message-container');

let message_input = document.querySelector('#send-input');

const appendUser = (message, position) => {

    const messageElement = document.createElement('div');
  
    messageElement.innerText = message;
  
    messageElement.classList.add('message');
  
    messageElement.classList.add(position);
    //messageElement.classList.add(position1);
  
    message_container.appendChild(messageElement);
    //message_container.appendChild(messageElement21);

}



  const appendMessage = (message, position) => {
      const messageElement = document.createElement('div');
      const userName = document.createElement('h4');
    const userMessage = document.createElement('div');

    messageElement.classList.add('message');
    messageElement.classList.add(position);

    userMessage.classList.add(`mess-${position}`);

    userMessage.innerText = message.message;
    userName.innerText = message.name;

    messageElement.appendChild(userName);
    messageElement.appendChild(userMessage);

    message_container.appendChild(messageElement);
}

appendUser(`You joined the chat`, "center");

socket.on('user-joined', (name) => {
    appendUser(`${name} joined the chat`, "center");
})

socket.on('recieve', (data) => {
    appendMessage(data, "incoming");
})

socket.on('user-leave', (data) => {
    appendUser(`${data.name} left the chat`, "center");
})

let button = document.querySelector('#send-button');

button.addEventListener('click', () => {
    console.log(message_input.value);
    let message = message_input.value;
    message_input.value = "";
    const data = {
        name: "You",
        message
    }
    appendMessage(data, 'outgoing');
    socket.emit('send-message', message);
})