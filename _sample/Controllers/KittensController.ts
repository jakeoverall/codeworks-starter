import { Controller, HttpGet, HttpPost, FromBody, Authorize } from "../../lib";
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
  @Authorize('teacher')
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