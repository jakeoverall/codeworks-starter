import { MapRoutes } from "./Internal/MapRoutes";
import { ConfigureAuthService, IAuthConfiguration } from "./Middleware/Authorize";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";

export class Startup {
  private _controllers: Dictionary<IController>;

  AuthService(config: IAuthConfiguration) {
    ConfigureAuthService(config)
  }

  set ControllerPath(path: string) {
    this._controllers = MapRoutes(path)
  }

  get Controllers() {
    return this._controllers
  }
}
