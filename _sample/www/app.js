// @ts-nocheck
let socket = io.connect();
let values = io.connect('/ValuesChannel');
let messages = document.getElementById("messages")

function writeMessage(command, message) {
  console.log(command, message)
  let li = document.createElement('li')
  li.innerText = message
  messages.appendChild(li)
}

let commands = {
  GROUPMESSAGE: "GROUPMESSAGE",
  CHANNELMESSAGE: "CHANNELMESSAGE",
  PRIVATEMESSAGE: "PRIVATEMESSAGE",
  SELFMESSAGE: "SELFMESSAGE",
  JOINGROUP: "JOINGROUP",
  LEAVEGROUP: "LEAVEGROUP",
  USERJOINED: "USERJOINED",
  USERLEFT: "USERLEFT",
  USERDISCONNECTED: "USERDISCONNECTED",
  ERROR: "ERROR"
}
for (let command in commands) {
  values.on(command, (payload) => writeMessage(command, payload))
}
values.on("/ValuesChannel", writeMessage)
socket.on('ERROR', (err) => console.error(err))

function sendMessage(e) {
  e.preventDefault()
  let command = e.target.command.value
  let message = e.target.message.value
  e.target.reset()
  socket.emit(command, message)
  values.emit(command, message)
}