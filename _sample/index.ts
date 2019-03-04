import { Program, EnableAuthorizeDecorator, SessionSerializer } from "../lib";

import sessions from './sessions'

let fakeDb = {
  "1a": { account: { role: 'super' } },
  "2b": { account: { role: 'admin' } },
  "3c": { account: { role: 'public' } }
}

let p = new Program({
  name: "TESTPROGRAM",
  controllersPath: __dirname + '/Controllers',
  middleware: [sessions.test.middleware, (req, res, next) => {
    req['user'] = fakeDb[req.session.uid]
    next()
  }, EnableAuthorizeDecorator],
  routerMount: "/"
})
p.configure.AuthService({
  Roles: ["public", "student", "teacher", "admin", "super"],
  UserRolePath: "account.role",
})

try {
  p.expressApp.listen(5000, () => {
    console.log("Listening on port 5000");
  })
} catch (err) {
  console.log(err);
}