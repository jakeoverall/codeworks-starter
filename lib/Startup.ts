import { ServiceCollection, IServiceCollection } from "./Services/IServiceCollection";
import { MapRoutes } from "./Internal/MapRoutes";
import { ConfigureAuthService, IAuthConfiguration } from "./Middleware/Authorize";

export class Startup {
  private Services: ServiceCollection = new ServiceCollection();
  private _controllerRoutes: any;

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
  get ControllerRoutes() {
    return this._controllerRoutes
  }
}
