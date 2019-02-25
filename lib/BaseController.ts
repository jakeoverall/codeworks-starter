import { ActionResult, Task } from "./Startup";
import { HttpContext } from "./HttpContext";
import { IHttpError, ErrorNotFound } from "./Errors/Errors";
import { Dictionary } from "./utils/Dictionary";
import { guid } from "./guid";


export default class BaseController {
  gets: Dictionary<Task<any>> = {}
  protected readonly HttpContext: HttpContext;
  public readonly endpoint: string;
  public readonly id: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.HttpContext = new HttpContext();
    this.id = guid.NewGuid()
  }

  Get<T>(routeParams: string, task: Task<T>) {
    this.gets[routeParams] = task
  }

  async HandleGet(routeParams: string): Promise<any> {
    try {
      let task = this.gets[routeParams]
      if (!task) { throw new ErrorNotFound() }
      let content = await task.Result
      return this.Send({ content, status: 200 })
    }
    catch (err) {
      this.SendError(err);
    }
  }

  private SendError(error: IHttpError): void {
    console.error("SEND TO CLIENT", error.status, error.message);
  }
  private Send<T>(actionResult: ActionResult<T>): Promise<T> {
    console.log("SENDING TO CLINET", actionResult)
    return null
  }

  Test() {
    console.log("TESTING CONTROLLER", this.id);
  }
}