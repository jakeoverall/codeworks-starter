import { Program, AuthMiddleware } from "../lib";

let p = new Program({
  name: "TESTPROGRAM",
  controllersPath: __dirname + '/Controllers',
  middleware: [(req, res, next) => {
    req['user'] = { account: { role: 'teacher' } }
    next()
  }, AuthMiddleware],
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