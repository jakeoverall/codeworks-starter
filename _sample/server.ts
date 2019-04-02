import { Area, EnableAuthorizeDecorator, EnableSessionUserSocket } from "../lib";
// import sessions from "./sessions";
import { ValuesChannel } from "./Channels/ValuesChannel";

let fakeDb = {
  "1a": { name: "super", account: { role: 'super' } },
  "2b": { name: "admin", account: { role: 'admin' } },
  "3c": { name: "Jake", account: { role: 'public' } }
}

// let session = sessions.test()

let testArea = new Area({
  name: "TESTPROGRAM",
  controllersPath: __dirname + '/Controllers',
  staticFiles: __dirname + "/../../_sample/www",
  middleware: [
    (req, res, next) => {
      //ADD THE USER TO REQ SOMEHOW
      req['user'] = fakeDb["2b"]
      next()
    },
    EnableAuthorizeDecorator
  ],
  sessionware: [
    // session.socketSession,
    (socket, next) => {
      socket.request['user'] = fakeDb[socket.request['session'].uid]
      next()
    },
    EnableSessionUserSocket
  ],
  channels: [ValuesChannel],
  routerMount: "/"
})
testArea.configure.SessionUserService({
  Roles: ["public", "student", "teacher", "admin", "super"],
  UserRolePath: "account.role",
})

export default testArea