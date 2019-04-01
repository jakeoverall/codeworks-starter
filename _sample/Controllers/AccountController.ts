
import { Controller, HttpGet, HttpPost, HttpPut, HttpDelete, SessionUser, Middleware, Authorize, BaseController } from "../../lib";

@Controller("Account")
export default class AccountController extends BaseController {
  @HttpGet()
  @Authorize("public")
  async Get() {
    return SessionUser().user
  }

  @HttpPost("login")
  async Login(_, body) {
    let id = ''
    switch (body.email) {
      case "super":
        id = "1a"
        break;
      case "admin":
        id = "2b"
        break;
      case "public":
        id = "3c"
        break;
    }
    SessionUser().session.uid = id
    return "success"
  }

  @HttpPost("register")
  async Register(_, body) {

  }

  @HttpDelete("logout")
  @Middleware((req, res, next) => {
    req.session.destroy()
    next()
  })
  async Delete() {
    return "successfully logged out"
  }
}
