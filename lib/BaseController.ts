import { Task } from "./utils/Task";
import { HttpContext } from "./HttpContext";
import { IHttpError, ErrorNotFound, ErrorBadRequest } from "./Errors/Errors";
import { Dictionary } from "./utils/Dictionary";
import { guid } from "./guid";

export type RequestType = "GET" | "POST" | "PUT" | "DELETE"

export type Request = {
  method: RequestType,
  params?: Dictionary<string>,
  query?: Dictionary<string>
  body?: Dictionary<any>
}

export type ActionResult<T> = {
  status: number,
  content: T
}

export default class BaseController {
  GET: Dictionary<Task<any>>
  POST: Dictionary<Task<any>>
  PUT: Dictionary<Task<any>>
  DELETE: Dictionary<Task<any>>
  protected readonly HttpContext: HttpContext;
  public readonly endpoint: string;
  public readonly id: string;
  public params: Dictionary<string> = {};
  public query: Dictionary<string> = {};
  public body: Dictionary<any> = {};
  name: string;

  constructor(endpoint: string = "") {
    if (!endpoint && !this.endpoint) { throw new Error("Failed to create controller you must provide an endpoint") }
    this.endpoint = this.endpoint || endpoint;
    this.HttpContext = new HttpContext();
    this.id = guid.NewGuid()
    this.GET = this.GET || {}
  }

  AddTask<T>(type: RequestType, routeParams: string, task: Task<T>) {
    this[type] = this[type] || {}
    this[type][routeParams] = task
  }

  async HandleTask(routeParams: string = "", req: Request = { method: "GET", params: {}, query: {}, body: {} }, res: any = undefined): Promise<any> {
    try {
      let type = req.method
      this.params = { ...req.params }
      this.query = { ...req.query }
      this.body = { ...req.body }
      let task = this[type][routeParams]
      if (!task) { throw new ErrorNotFound() }
      task.BindContext(this)
      task.Args = [req.params, req.body, req.query]
      let content = await task.Result
      if (!content) { throw new ErrorBadRequest(routeParams) }
      return this.Send({ content, status: 200 })
    }
    catch (err) {
      this.SendError(err, routeParams);
    }
  }

  private SendError(error: IHttpError, routeParams: string): void {
    console.error("SEND ERROR TO CLIENT", error.status, error.message, this.endpoint, routeParams);
  }
  private Send<T>(actionResult: ActionResult<T>): void {
    console.log("SENDING TO CLIENT", actionResult)
    return null
  }

  Test() {
    console.log("TESTING CONTROLLER", this.name, this.id);
  }
}