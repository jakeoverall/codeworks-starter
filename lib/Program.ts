import express from 'express';
import { Startup } from "./Startup";

export interface IAppConfig {
  controllersPath: string,
  routerMount: string,
  name: string
}

export class Program {
  configure: Startup;
  expressApp: express.Application;
  router: express.Router;
  name: string
  constructor(config: IAppConfig = { controllersPath: 'controllers', routerMount: "", name: "unnamed program" }) {
    this.configure = new Startup()
    this.expressApp = express()
    this.configure.ControllerPath = config.controllersPath || __dirname + '/Controllers'
    this.router = this.configure.ControllerRoutes
    this.expressApp.use((req, res, next) => {
      console.log("INCOMING REQUEST");
      next()
    })
    this.expressApp.use(config.routerMount, this.router)
    this.expressApp.use((req, res, next) => {
      res.status(404).send("NOT FOUND")
    })
  }
}