import { Dictionary } from "../utils/Dictionary";
import { IController } from "../Controllers/IController";


export function MapRoutes(path: string): Dictionary<IController> {
  try {
    let controllers = require(path) as Dictionary<IController>;
    return controllers
  } catch (err) {
    throw err
  }
}