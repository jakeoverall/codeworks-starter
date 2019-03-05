import { Program, EnableAuthorizeDecorator, EnableAuthorizedSocket } from "../lib";
import sessions from './sessions'
import http from 'http'
import { ValuesChannel } from './Channels/ValuesChannel'

let fakeDb = {
  "1a": { name: "super", account: { role: 'super' } },
  "2b": { name: "admin", account: { role: 'admin' } },
  "3c": { name: "Jake", account: { role: 'public' } }
}

let p = new Program({
  name: "TESTPROGRAM",
  controllersPath: __dirname + '/Controllers',
  staticFiles: __dirname + "/../../_sample/www",
  middleware: [
    sessions.test.middleware,
    (req, res, next) => {
      req['user'] = fakeDb[req['session'].uid]
      next()
    },
    EnableAuthorizeDecorator
  ],
  sessionware: [
    sessions.test.socketSession,
    (socket, next) => {
      socket.request['user'] = fakeDb[socket.request['session'].uid]
      next()
    },
    EnableAuthorizedSocket
  ],
  channels: [ValuesChannel],
  routerMount: "/"
})
p.configure.AuthService({
  Roles: ["public", "student", "teacher", "admin", "super"],
  UserRolePath: "account.role",
})

try {
  let server = http.createServer(p.expressApp)
  p.io.attach(server)
  server.listen(5000, () => {
    console.log("Listening on port 5000");
  })
} catch (err) {
  console.log(err);
}