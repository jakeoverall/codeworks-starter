import socketIO from 'socket.io'
import { Channel, Authorize } from "../../lib";

export class ValuesChannel extends Channel {
  init(context: Channel, socket: socketIO.Socket): void {
    socket.on(
      "SOMETHINGELSE",
      (payload) => this.SOMEMETHOD.apply(context, [socket, payload])
    )
  }

  SOMEMETHOD(socket, payload) {
    if (!this.Authorize("admin", socket)) { return }
    this.io.of(this.channelName).emit("BLARG", "BLARG BLARG")
  }
}