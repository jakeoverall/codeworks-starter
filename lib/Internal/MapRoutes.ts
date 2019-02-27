import fs from 'fs';
import Path from 'path'
import BaseController, { RequestBasics, RequestType, ActionResult } from "../BaseController";
import { Router } from 'express'
import { Injector } from "../utils/Injector";

const router = Router()
export function MapRoutes(path: string): Router {
  getFiles(path)
  return router
}

function getFiles(path: string) {
  let files: Array<string>
  let root = Path.dirname(require.main.filename)
  let controllersPath = root + '/./' + path
  try {
    files = fs.readdirSync(controllersPath);
  } catch (err) {
    throw err
  }
  files.forEach(function (file) {
    let test = new RegExp(/controller/, 'ig')
    if (!test.test(file)) return;

    let controller = require(controllersPath + '/' + file);
    try {
      controller.default ? registerController(controller.default) : registerController(controller)
    } catch (e) {
      console.error('[MODEL ERROR] unable to load model in ', file, e)
    }
  });
}

function registerController(controller: any) {
  let resolved = Injector.resolve<BaseController>(controller)
  for (let method in resolved.METHODS) {
    let m = method as RequestType
    let params = resolved.METHODS[m]
    for (let param in params) {
      let p = resolved.endpoint + '/' + param
      router[m](p, async (req, res) => {
        let c = Injector.resolve<BaseController>(controller)
        let result: ActionResult
        try {
          result = await c.HandleTask(param, req as RequestBasics)
        } catch (e) {
          res.status(e.status)
        } finally {
          res.send(result.content)
        }
      })
    }
  }
}
