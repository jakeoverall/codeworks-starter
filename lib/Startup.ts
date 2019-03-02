import { ServiceCollection, IServiceCollection } from "./Services/IServiceCollection";
import { MapRoutes } from "./Internal/MapRoutes";
import { ConfigureAuthService, IAuthConfiguration } from "./Middleware/Authorize";
import { Router } from "express";
import { Dictionary } from "./utils/Dictionary";
import { IController } from "./Controllers/IController";


export class Startup {
  private Services: ServiceCollection = new ServiceCollection();
  private _controllers: Dictionary<IController>;

  AuthService(config: IAuthConfiguration) {
    ConfigureAuthService(config)
  }

  // ConfigureServices(configuration: (services: IServiceCollection) => void): Startup {
  //   configuration(this.Services)
  //   return this
  // };

  set ControllerPath(path: string) {
    this._controllers = MapRoutes(path)
  }
  get Controllers() {
    return this._controllers
  }
}
