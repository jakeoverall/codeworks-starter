import { Program, AuthMiddleware } from "../lib";

let p = new Program({
  name: "TESTPROGRAM",
  controllersPath: __dirname + '/Controllers',
  routerMount: "/"
})
p.configure.AuthService({
  Roles: ["public", "student", "teacher", "admin", "super"],
  UserRolePath: "account.role"
})
p.router.use(AuthMiddleware)

try {
  p.expressApp.listen(5000, () => {
    console.log("Listening on port 5000");
  })
} catch (err) {
  console.log(err);
}