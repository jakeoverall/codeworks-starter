import express = require("express");
import { Router } from 'express'
import * as bodyParser from 'body-parser'
import { Startup } from "./Startup";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";
import { Injector } from './utils/Injector'
import { RequestHandler, NextFunction } from "express-serve-static-core";
import socketio from 'socket.io'
import { Channel } from "./Channels/Channel";

export type IAppConfig = {
  controllersPath: string,
  routerMount: string,
  name: string,
  middleware?: Array<RequestHandler>
  sessionware?: Array<(socket: socketio.Socket, next: NextFunction) => void>
  staticFiles?: string,
  channels?: Array<typeof Channel>
}

export class Program {
  private router: express.Router;
  private middleware: Array<RequestHandler>;
  private sessionware: Array<(socket: socketio.Socket, next: NextFunction) => void>
  name: string
  configure: Startup;
  expressApp: express.Application;
  routerMount: string;
  io: socketio.Server;
  channels: Array<typeof Channel>;

  constructor(config: IAppConfig) {
    this.configureApp(config);
    this.configureSockets(config);
    this.configureRouter(config);
  }

  private configureApp(config: IAppConfig) {
    this.name = config.name;
    this.routerMount = config.routerMount;
    this.configure = new Startup();
    this.expressApp = express();
    this.expressApp.use(bodyParser.json({ limit: '50mb' }));
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
    this.configure.ControllerPath = config.controllersPath;
    if (config.staticFiles) {
      this.expressApp.use(this.routerMount, express.static(config.staticFiles))
    }
  }

  private configureSockets(config: IAppConfig) {
    this.io = socketio();
    this.sessionware = config.sessionware || [];
    this.channels = config.channels || [];
    this.sessionware.forEach(fn => this.io.use(fn));
    this.channels.forEach(channel => {
      new Channel(channel.name, this.io).OnConnected(channel.prototype)
    })
  }

  private configureRouter(config: IAppConfig) {
    this.middleware = config.middleware;
    this.router = Router();
    if (this.middleware) {
      this.expressApp.use(this.middleware);
    }
    this.addControllers(this.configure.Controllers);
    this.expressApp.use(this.routerMount, this.router);
  }

  protected addControllers(controllers: Dictionary<IController>): void {
    let count = 0;

    Object.keys(controllers).forEach(prop => {
      let controller = controllers[prop]
      try {
        if (!controller.prototype.endpoint) { throw new Error("Invalid Controller no endpoint specified, please use the controller decorator") }
        this.router.use(controller.prototype.endpoint, this.registerController(controller))
        count++
      } catch (err) {
        console.warn(prop, "CONTROLLER NOT REGISTERED", err);
      }
    })
    console.log(count + ` controllers configured.`);
  }


  private registerController(controller: any): Router {

    let router = Router();

    for (let member in controller.prototype.methods) {

      let route = (controller.prototype)[member];

      if (route && route.config) {
        this.registerRoute(route, controller, member, router);
      }
    }
    return router;
  }


  private registerRoute(route: any, controller: any, member: string, router) {
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