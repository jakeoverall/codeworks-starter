import { ServiceCollection, IServiceCollection } from "./Services/IServiceCollection";
import { MapRoutes } from "./Internal/MapRoutes";
import { ConfigureAuthService, IAuthConfiguration } from "./Middleware/Authorize";
import { Router } from "express";

export class Startup {
  private Services: ServiceCollection = new ServiceCollection();
  private _controllerRoutes: Router;

  AuthService(config: IAuthConfiguration) {
    ConfigureAuthService(config)
  }

  // ConfigureServices(configuration: (services: IServiceCollection) => void): Startup {
  //   configuration(this.Services)
  //   return this
  // };

  set ControllerPath(path: string) {
    this._controllerRoutes = MapRoutes(path)
  }
  get ControllerRoutes() : Router {
    return this._controllerRoutes
  }
}
