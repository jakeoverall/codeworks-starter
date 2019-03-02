import { Task } from "./Task";
import { ErrorNotFound, ErrorBadRequest } from "../Errors/Errors";
import { Dictionary } from "../utils/Dictionary";
import { guid } from "../utils/guid";
import { IController } from './IController'

export type RequestType = "get" | "post" | "put" | "delete"

export interface RequestBasics {
  method: RequestType,
  params?: Dictionary<string>,
  query?: Dictionary<string>
  body?: Dictionary<any>
}

export type ActionResult = {
  status: number,
  content: any
}

export type RequestTypes = {
  [prop in RequestType]: Dictionary<Task<any>>;
};

export default class BaseController {
  config: any;
  public readonly endpoint: string;
  public readonly id: string;
  public params: Dictionary<string> = {};
  public query: Dictionary<string> = {};
  public body: Dictionary<any> = {};
  public name: string = "";

  constructor(endpoint: string = "") {
    if (!endpoint && !this.endpoint) { throw new Error("Failed to create controller you must provide an endpoint") }
    this.endpoint = this.endpoint || endpoint;
    this.id = guid.NewGuid()
  }

  // AddTask<T>(type: RequestType, routeParams: string, task: Task<T>) {
  //   this.METHODS = this.METHODS || { get: {}, post: {}, put: {}, delete: {} }
  //   this.METHODS[type] = this.METHODS[type] || {}
  //   this.METHODS[type][routeParams] = task
  // }

  // async HandleTask(routeParams: string = "", req: RequestBasics): Promise<ActionResult> {
  //   try {
  //     let type = req.method.toLowerCase() as RequestType
  //     let task = this.METHODS[type][routeParams]
  //     if (!task) { throw new ErrorNotFound() }
  //     this.params = { ...req.params }
  //     this.query = { ...req.query }
  //     this.body = { ...req.body }
  //     task.BindContext(this)
  //     task.Args = [req.params, req.body, req.query]
  //     let content = await task.Result
  //     if (!content) { throw new ErrorBadRequest(routeParams) }
  //     return { content, status: 200 }
  //   }
  //   catch (err) {
  //     throw err;
  //   }
  // }
}