import { Controller, HttpGet, HttpPost, FromBody, Authorize, Middleware, SessionUser } from "../../lib";
import { KittensService } from "../Services/KittensService";
import { Kitten } from "../Models/Kitten";

@Controller("kittens")
export default class KittensController {
  _ks: KittensService;
  constructor(ks: KittensService) {
    this._ks = ks;
  }

  @HttpGet()
  @Middleware([function (req, res, next) {
    console.log('MIDDLEWARE 1', SessionUser().user);
    next()
  }, function (req, res, next) {
    console.log('MIDDLEWARE 2');
    next()
  }])
  GetKittens(_) {
    return this._ks.Find()
  }

  @HttpGet(":id")
  async GetKitten({ id }) {
    return await this._ks.FindOne(id)
  }

  @HttpPost()
  @FromBody(Kitten)
  @Authorize('admin')
  async CreateKitten(_, kitten: Kitten) {
    return await this._ks.Create(kitten)
  }

}