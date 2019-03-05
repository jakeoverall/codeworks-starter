// @ts-nocheck
let socket = io.connect();
let values = io.connect('/ValuesChannel');
let messages = document.getElementById("messages")

function writeMessage(message){
  console.log(message)
  let li = document.createElement('li')
  li.innerText = message
  messages.appendChild(li)
}

values.on('USERJOINED', writeMessage)
values.on('BLARG', writeMessage)
values.on("/ValuesChannel", writeMessage)

socket.on('message', writeMessage)

function sendMessage(e) {
  e.preventDefault()
  let command = e.target.command.value
  let message = e.target.message.value
  e.target.reset()
  socket.emit(command, message)
  values.emit(command, message)
}