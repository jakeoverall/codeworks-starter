import { MapRoutes } from "./Internal/MapRoutes";
import { ConfigureSessionUserService, IUserSessionConfig } from "./Middleware/Authorize";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";

export class Startup {
  private _controllers: Dictionary<IController> = {};

  SessionUserService(config: IUserSessionConfig) {
    ConfigureSessionUserService(config)
  }

  set ControllerPath(path: string) {
    this._controllers = MapRoutes(path)
  }

  get Controllers() {
    return this._controllers
  }
}
