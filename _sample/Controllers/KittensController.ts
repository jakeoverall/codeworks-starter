import { Controller, HttpGet, HttpPost, FromBody, Authorize, Middleware } from "../../lib";
import BaseController from "../../lib/Controllers/BaseController";
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
    console.log('MIDDLEWARE 1');
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
  @Authorize('teacher')
  async CreateKitten(_, kitten: Kitten) {
    return await this._ks.Create(kitten)
  }

}