import { Dictionary } from "../utils/Dictionary";
import { NextFunction } from "connect";

export interface IController extends Function {
  endpoint: string
  config: any
  methods: Dictionary<string>
}

export class HttpContext {
  req: { [x: string]: any }
  res: { [x: string]: any }
  body: { [x: string]: any }
  params: { [x: string]: any }
  query: { [x: string]: any }
  cookies: { [x: string]: any }
  user: { [x: string]: any }
  session: { [x: string]: any }
  next: NextFunction

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req
    this.res = res
    this.params = req['params'] || {}
    this.body = req['body'] || {}
    this.query = req['query'] || {}
    this.cookies = req['cookies'] || {}
    this.user = req['user'] || {}
    this.session = req['session'] || {}
    this.next = next
  }
}

export class BaseController {
  HttpContext: HttpContext
  constructor(req: Request, res: Response, next: NextFunction) {
    this.HttpContext = new HttpContext(req, res, next)
  }
}