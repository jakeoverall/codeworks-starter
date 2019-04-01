import { Dictionary } from "../utils/Dictionary";
import { NextFunction } from "connect";

export interface IController extends Function {
  endpoint: string
  config: any
  methods: Dictionary<string>
  // [prop: string]: (...args: any[]) => any;
}

export class HttpContext {
  req: {}
  res: {}
  body: {}
  params: {}
  query: {}
  cookies: {}
  user: {}
  session: {}
  next: Function
  cache: {}

  constructor(req: Request, res: Response, next: Function) {
    this.req = req
    this.res = res
    this.params = req.params || {}
    this.body = req.body || {}
    this.query = req.query || {}
    this.cookies = req.cookies || {}
    this.user = req.user || {}
    this.session = req.session || {}
    this.next = next
  }
}

export class BaseController {
  HttpContext: HttpContext
  constructor(req: Request, res: Response, next: NextFunction) {
    this.HttpContext = new HttpContext(req, res, next)

  }
}