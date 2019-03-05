import socketIO from 'socket.io'
import { UserService } from '../Middleware/Authorize'

export const COMMANDS = {
  GROUPMESSAGE: "GROUPMESSAGE",
  CHANNELMESSAGE: "CHANNELMESSAGE",
  PRIVATEMESSAGE: "PRIVATEMESSAGE",
  SELFMESSAGE: "SELFMESSAGE",
  USERJOINED: "USERJOINED",
  USERDISCONNECTED: "USERDISCONNECTED",
  JOINGROUP: "JOINGROUP",
  LEAVEGROUP: "LEAVEGROUP"
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
      this.io.of(this.channelName).emit(this.channelName, `JOINED ${this.channelName}`)
      this.io.of(this.channelName).emit(COMMANDS.USERJOINED, socket.id)

      socket.on(COMMANDS.CHANNELMESSAGE, this.SendToChannel.bind(this))
      socket.on(COMMANDS.GROUPMESSAGE, (payload) => this.SendToGroup(payload.groupName, payload))
      socket.on(COMMANDS.PRIVATEMESSAGE, this.SendToConnectionId.bind(this))
      socket.on(COMMANDS.SELFMESSAGE, this.SendToMe.bind(this))
      socket.on(COMMANDS.JOINGROUP, this.JoinGroup.bind(this))
      socket.on(COMMANDS.LEAVEGROUP, this.LeaveGroup.bind(this))
      socket.on("disconnect", this.OnDisconnected.bind(this))
      channel.init(this, socket)
    });
  }

  OnDisconnected(socket: socketIO.Socket) {
    for (let room in socket.rooms) {
      this.SendToGroup(room, {
        message: "User Disconnected",
        socketId: socket.id,
        user: UserService().user
      })
    }
    this.io.of(this.channelName).emit(COMMANDS.USERDISCONNECTED, socket.id);
  }

  SendToMe(payload: any) {
    try {
      UserService().socket.emit(COMMANDS.SELFMESSAGE, payload)
    } catch (err) {
      console.error(err);
    }
  }

  SendToConnectionId(payload: any) {
    let connectionId = payload.connectionId
    if (!connectionId) {
      return this.SendError(
        COMMANDS.PRIVATEMESSAGE,
        new Error("Invalid Payload must provide a connectionId")
      )
    }
    this.io.to(connectionId).emit(COMMANDS.PRIVATEMESSAGE, payload)
  }

  SendToChannel(payload: any) {
    this.io.of(this.channelName).emit(COMMANDS.CHANNELMESSAGE, payload)
  }

  SendToGroup(groupName: string, payload: any) {
    this.io.of(this.channelName).to(groupName).emit(COMMANDS.GROUPMESSAGE, payload)
  }

  JoinGroup(groupName: string) {
    try {
      UserService().socket.join(groupName)
    } catch (err) {
      console.error(err);
    }
    this.io.of(this.channelName).to(groupName).emit(COMMANDS.USERJOINED)
  }

  LeaveGroup(groupName: string) {
    try {
      UserService().socket.leave(groupName)
    } catch (err) {
      console.error(err);
    }
  }

  SendError(command: string, err: Error) {
    try {
      UserService().socket.emit(COMMANDS.SELFMESSAGE, { ...err, channel: this.channelName, command })
    } catch (err) {
      console.error(err);
    }
  }
}