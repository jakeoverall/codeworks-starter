import { Socket } from 'socket.io'
import { Channel } from "../../lib";

export class ValuesChannel extends Channel {
  init(context: Channel, socket: Socket): void {
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