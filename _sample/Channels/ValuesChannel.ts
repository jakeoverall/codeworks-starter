import { Channel, Authorize } from "../../lib";

export class ValuesChannel extends Channel {
  init(context: Channel, socket: SocketIO.Socket): void {
    socket.on("SOMETHINGELSE", this.SOMEMETHOD.bind(context))
  }
  
  @Authorize("super")
  SOMEMETHOD() {
    this.io.of(this.channelName).emit("BLARG", "BLARG BLARG")
  }
}