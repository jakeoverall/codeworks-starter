import { Controller, HttpGet } from "../../lib";
import BaseController from "../../lib/BaseController";
import { KittensService } from "../Services/KittensService";

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

}