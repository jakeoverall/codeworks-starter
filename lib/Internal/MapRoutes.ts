import fs from 'fs';
import BaseController, { RequestBasics, RequestType, ActionResult } from "../BaseController";
import { Router } from 'express'
import { Injector } from "../utils/Injector";

let router = Router()
export function MapRoutes(path: string): Router {
  return getControllersFromIndex(path)
}

function getControllersFromIndex(path: string) {
  try {
    let controllers = require(path);
    for (let name in controllers) {
      registerController(controllers[name])
    }
    return router
  } catch (err) {
    throw err
  }
}

function registerController(controller: any): Router {
  let resolved = Injector.resolve<BaseController>(controller)
  Object.keys(resolved.METHODS).forEach(method => {
    let m = method as RequestType
    let params = resolved.METHODS[m]
    Object.keys(params).forEach(param => {
      let p = "/" + resolved.endpoint + '/' + param
      if (process.env.NODE_ENV == "debug") {
        console.log(m, p);
      }
      router[m](p, async (req, res) => {
        let c = Injector.resolve<BaseController>(controller)
        let result: ActionResult = { status: 200, content: {} }
        try {
          result = await c.HandleTask(param, req as RequestBasics)
          return res.status(200).send(result)
        } catch (e) {
          res.status(e.status || 400).send({ ...e, status: e.status, message: e.message })
        }
      })
    })
  })
  return router
}
