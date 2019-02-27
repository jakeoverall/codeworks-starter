import express from 'express';
import { Startup } from "./Startup";

export interface IAppConfig {
  controllersPath: string,
  routerMount: string,
  name: string,
  logRequests?: boolean
}

export class Program {
  configure: Startup;
  expressApp: express.Application;
  router: express.Router;
  name: string
  constructor(config: IAppConfig) {
    this.configure = new Startup()
    this.expressApp = express()
    this.configure.ControllerPath = config.controllersPath
    this.router = this.configure.ControllerRoutes
    if (config.logRequests) {
      this.expressApp.use((req, res, next) => {
        console.log("INCOMING REQUEST");
        next()
      })
    }
    this.expressApp.use(config.routerMount, this.router)
  }
}