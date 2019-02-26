import { ScopedService } from "./ScopedService";
import { SingletonService } from "./SingletonService";
import BaseService from "./BaseService";
import { Dictionary } from "../utils/Dictionary";
export interface IServiceCollection {
  AddScoped(name: string, service: typeof ScopedService): void;
  AddSingleton(name: string, service: typeof SingletonService): void;
  AddTransient(name: string, service: typeof BaseService): void;
}
export class ServiceCollection implements IServiceCollection {
  _scoped: Dictionary<typeof ScopedService> = {};
  _singleton: Dictionary<typeof SingletonService> = {};
  _transient: Dictionary<typeof BaseService> = {};
  AddScoped(name: string, service: typeof ScopedService): void {
    this._scoped[name] = service;
  }
  AddSingleton(name: string, service: typeof SingletonService): void {
    this._singleton[name] = service;
  }
  AddTransient(name: string, service: typeof BaseService): void {
    this._transient[name] = service;
  }
}
