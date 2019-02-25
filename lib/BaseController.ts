import { ActionResult } from "./Startup";
import { HttpContext } from "./HttpContext";
export default class BaseController {
  protected readonly HttpContext: HttpContext;
  public readonly endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.HttpContext = new HttpContext();
  }
  async Get<T>(routeParams: string, actionResult: ActionResult<T>) {
    try {
      let result = await actionResult();
      if (!result) {
        throw new Error(`[${this.endpoint.toUpperCase()} ERROR]`);
      }
    }
    catch (err) {
      this.SendError(err);
    }
  }
  SendError(error: Error) {
    console.error(error);
  }
}
