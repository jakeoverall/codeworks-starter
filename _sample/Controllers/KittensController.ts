import { Controller, HttpGet, HttpPost, FromBody } from "../../lib";
import BaseController from "../../lib/BaseController";
import { KittensService } from "../Services/KittensService";
import { Kitten } from "../Models/Kitten";

@Controller("kittens")
export default class KittensController extends BaseController {
  _ks: KittensService;
  constructor(ks: KittensService) {
    super();
    this._ks = ks;
  }

  @HttpGet()
  async GetKittens() {
    return Promise.resolve(this._ks.Find())
  }

  @HttpGet(":id")
  async GetKitten({ id }) {
    return await this._ks.FindOne(id)
  }

  @HttpPost()
  @FromBody(Kitten)
  async CreateKitten(_, kitten: Kitten) {
    return await this._ks.Create(kitten)
  }

}