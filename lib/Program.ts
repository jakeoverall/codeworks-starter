import express, { Router } from 'express';
import bodyParser from 'body-parser'
import { Startup } from "./Startup";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";
import { Injector } from './utils/Injector'
import { RequestHandler } from "express-serve-static-core";

export interface IAppConfig {
  controllersPath: string,
  routerMount: string,
  name: string,
  logRequests?: boolean,
  middleware?: Array<RequestHandler>
}

export class Program {
  configure: Startup;
  expressApp: express.Application;
  router: express.Router;
  name: string
  routerMount: string;
  middleware: Array<RequestHandler>;
  constructor(config: IAppConfig) {
    this.configure = new Startup()
    this.expressApp = express()
    this.expressApp.use(bodyParser.json({ limit: '50mb' }))
    this.expressApp.use(bodyParser.urlencoded({ extended: true }))
    this.configure.ControllerPath = config.controllersPath
    if (config.logRequests) {
      this.expressApp.use((req, res, next) => {
        console.log("INCOMING REQUEST");
        next()
      })
    }
    this.middleware = config.middleware || []
    this.routerMount = config.routerMount
    this.router = Router()
    this.addControllers(this.configure.Controllers)
    this.expressApp.use(this.middleware)
    this.expressApp.use(this.routerMount, this.router)
    this.expressApp.use((req, res) => {
      res.status(404).send("NOT FOUND")
    })
  }

  protected addControllers(controllers: Dictionary<IController>): void {
    let count = 0;

    Object.keys(controllers).map(prop => {
      let controller = controllers[prop]
      try {
        this.router.use(controller.prototype.endpoint, this._buildRouter(controller))
        count++
      } catch (err) {
        console.warn(prop, "CONTROLLER NOT REGISTERED", err);
      }
    })

    console.log(count + ` controllers configured.`);
  }


  private _buildRouter(controller: any): Router {

    let router = Router();

    for (let member in controller.prototype.methods) {

      let route = (controller.prototype)[member];

      if (route && route.config) {

        let { middleware, method, path } = route.config;

        let callBack = (req: Request, res: Response) => {
          let c = Injector.resolve(controller)
          return ((c)[member])(req, res);
        };

        if (middleware) {
          router[method](path, middleware, callBack);
        } else {
          router[method](path, callBack);
        }
      }
    }

    return router;
  }

}