import socketIO from 'socket.io'
import { UserService } from '../Middleware/Authorize'
import { ErrorUnAuthorized, ErrorBadRequest } from "../Errors/Errors";

export const COMMANDS = {
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

const COMMANDMETHODS = {
  GROUPMESSAGE: "SendToGroup",
  CHANNELMESSAGE: "SendToChannel",
  PRIVATEMESSAGE: "SendToConnectionId",
  SELFMESSAGE: "SendToMe",
  JOINGROUP: "JoinGroup",
  LEAVEGROUP: "LeaveGroup"
}

export class Channel {
  channelName: string;
  io: socketIO.Server;
  name: string
  constructor(channelName: string, io: socketIO.Server) {
    if (!channelName || !io) { throw new Error("Unable to create channel you must provide a channelName and instance of io") }
    this.channelName = "/" + channelName
    this.io = io
  }

  /**
   * This method will be called for each socket that joins the channel
   * to keep the appropriate context of this you may need to bind the
   * context  -> socket.on("EVENT", LocalMethod.bind(context))
   * @param context 
   * @param socket 
   */
  init(context: Channel, socket: socketIO.Socket): void {
    throw new Error("SUPER CHANNEL INIT WAS CALLED")
  }

  OnConnected(channel) {
    this.io.of(this.channelName).on('connection', (socket) => {
      let user = socket.request.user;
      socket.emit(this.channelName, `JOINED ${this.channelName}`)
      this.io.of(this.channelName).emit(COMMANDS.USERJOINED, { socketId: socket.id, user })

      for (let command in COMMANDMETHODS) {
        socket.on(command, (payload) => {
          let method = COMMANDMETHODS[command]
          this[method](socket, payload)
        })
      }
      socket.on("disconnect", () => this.OnDisconnected(user))
      channel.init(this, socket)
    });
  }

  OnDisconnected(user: any) {
    this.io.of(this.channelName).emit(COMMANDS.USERDISCONNECTED, user);
  }

  SendToMe(socket: socketIO.Socket, payload: any) {
    try {
      socket.emit(COMMANDS.SELFMESSAGE, payload)
    } catch (err) {
      this.SendError(socket, COMMANDS.SELFMESSAGE, err)
    }
  }

  SendToConnectionId(socket: socketIO.Socket, payload: any) {
    let connectionId = payload.connectionId
    if (!connectionId) {
      return this.SendError(
        socket,
        COMMANDS.PRIVATEMESSAGE,
        new Error("Invalid Payload must provide a connectionId")
      )
    }
    this.io.to(connectionId).emit(COMMANDS.PRIVATEMESSAGE, payload)
  }

  SendToChannel(socket: socketIO.Socket, payload: any) {
    this.io.of(this.channelName).emit(COMMANDS.CHANNELMESSAGE, payload)
  }

  SendToGroup(socket: socketIO.Socket, payload: any) {
    if (!payload.groupName || !payload.data) {
      return this.SendError(socket, COMMANDS.GROUPMESSAGE, new ErrorBadRequest("Payload must specify groupName && data"))
    }
    let group = this.channelName + ":" + payload.groupName
    if (!socket.rooms[group]) { return }
    this.io.of(this.channelName).to(group).emit(COMMANDS.GROUPMESSAGE, payload)
  }

  JoinGroup(socket: socketIO.Socket, groupName: string) {
    try {
      let group = this.channelName + ":" + groupName
      if (socket.rooms[group]) { return }
      socket.join(group)
      this.io.of(this.channelName).to(group).emit(COMMANDS.USERJOINED, socket.request['user'])
    } catch (err) {
      return this.SendError(socket, COMMANDS.JOINGROUP, err)
    }
  }

  LeaveGroup(socket: socketIO.Socket, groupName: string) {
    try {
      let group = this.channelName + ":" + groupName
      if (!socket.rooms[group]) { return }
      socket.leave(group)
      this.io.of(this.channelName).to(group).emit(COMMANDS.USERLEFT, socket.request['user'])
    } catch (err) {
      return this.SendError(socket, COMMANDS.LEAVEGROUP, err)
    }
  }

  SendError(socket: socketIO.Socket, command: string, err: Error) {
    try {
      socket.emit(COMMANDS.ERROR, { ...err, message: err.message, channel: this.channelName, command })
    } catch (err) {
      console.error(err);
    }
  }

  Authorize(role: string | number, socket: socketIO.Socket) {
    try {
      if (!socket.request['authService'].hasAccess(role)) {
        throw new ErrorUnAuthorized()
      }
      return true
    } catch (err) {
      this.SendError(socket, "Access Denied", err)
      return false
    }
  }
}