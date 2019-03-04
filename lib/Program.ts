import express = require("express");
import { Router } from 'express'
import * as bodyParser from 'body-parser'
import { Startup } from "./Startup";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";
import { Injector } from './utils/Injector'
import { RequestHandler, RequestHandlerParams } from "express-serve-static-core";

export type IAppConfig = {
  controllersPath: string,
  routerMount: string,
  name: string,
  logRequests?: boolean,
  middleware?: Array<RequestHandler>
}

export class Program {
  private router: express.Router;
  private middleware: Array<RequestHandler>;

  name: string
  configure: Startup;
  expressApp: express.Application;
  routerMount: string;

  constructor(config: IAppConfig) {
    this.name = config.name
    this.configure = new Startup()
    this.expressApp = express()
    this.expressApp.use(bodyParser.json({ limit: '50mb' }))
    this.expressApp.use(bodyParser.urlencoded({ extended: true }))
    this.configure.ControllerPath = config.controllersPath
    if (config.logRequests) {
      this.expressApp.use((req, res, next) => {
        console.log("[INCOMING REQUEST]", this.name, req.url);
        next()
      })
    }
    this.middleware = config.middleware
    this.routerMount = config.routerMount
    this.router = Router()
    if (this.middleware) {
      this.expressApp.use(this.middleware)
    }
    this.addControllers(this.configure.Controllers)
    this.expressApp.use(this.routerMount, this.router)
  }

  protected addControllers(controllers: Dictionary<IController>): void {
    let count = 0;

    Object.keys(controllers).forEach(prop => {
      let controller = controllers[prop]
      try {
        if (!controller.prototype.endpoint) { throw new Error("Invalid Controller no endpoint specified, please use the controller decorator") }
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
        this.registerController(route, controller, member, router);
      }
    }
    return router;
  }


  private registerController(route: any, controller: any, member: string, router) {
    let { middleware, method, path } = route.config;
    let callBack = (req: Request, res: Response) => {
      let c = Injector.resolve(controller);
      return ((c)[member])(req, res);
    };
    if (middleware) {
      router[method](path, middleware, callBack);
    }
    else {
      router[method](path, callBack);
    }
  }
}