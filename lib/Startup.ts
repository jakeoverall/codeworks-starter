import { ScopedService } from "./Services/ScopedService";
import { Service } from "./Services/ServiceDecorator";
import { Injector } from "./utils/Injector";
import { Controller } from "./utils/Decorators";
import BaseService from "./Services/BaseService";
import BaseController from "./BaseController";
import { Dictionary } from "./utils/Dictionary";
import { ServiceCollection, IServiceCollection } from "./IServiceCollection";
import { ErrorBadRequest } from "./Errors/Errors";

class ControllerCollection {
  _controllers: Dictionary<any> = {}
  Add<T>(name: string, controller: T) {
    this._controllers[name] = controller
  }
}

export class Startup {
  private static Services: ServiceCollection = new ServiceCollection();
  private static Controllers: ControllerCollection = new ControllerCollection();

  static ConfigureServices(configuration: (services: IServiceCollection) => void): void {
    configuration(Startup.Services)
  };
  static Configure(configuration: (controllers: ControllerCollection) => void): void {
    configuration(this.Controllers)
  };
  static HandleRequest(prop: string, handler: (controllers: ControllerCollection, prop: string) => void): void {
    handler(this.Controllers, prop);
  }
}

@Service()
class TestScopedService extends ScopedService {
  init(): void {
    console.log("[TEST SCOPED SERVICE]", this.id)
  }
}

@Service()
class TestTransientService extends BaseService {
  init(): void {
    console.log("[TEST TRANSIENT SERVICE]", this.id)
  }
}

// function _registerRoute(method: string, routeParams: string) { }

export class Task<T> extends Promise<T> {
  __fn: Function;
  private async Run<T>(): Promise<T> {
    try {
      return await this.__fn()
    } catch (err) {
      throw err
    }
  }

  get Result(): Promise<T> {
    return this.Run()
  }

  constructor(fn: () => Promise<T> | T) {
    super(() => { });
    this.__fn = fn
  }
}

// let x = new Task(model.find()).Result

export type ActionResult<T> = {
  status: number,
  content: T
}

@Controller()
class Bananas extends BaseController {
  _ts: TestScopedService;
  _ts2: TestTransientService;
  constructor(ts: TestScopedService, ts2: TestTransientService) {
    super("Bananas");
    this._ts = ts;
    this._ts2 = ts2;
    console.log("SCOPED", this._ts.id);
    console.log("TRANSIENT", this._ts2.id);
  }

  register() {
    this.Get('bananas', new Task<number>(() => {
      // throw new ErrorBadRequest("Testing Bad Requests")
      return 7;
    }))

  }

  async Test() {
    super.Test()
    await this.HandleGet('neatbananas')
    await this.HandleGet('bananas')
  }
}

@Controller()
class Kittens extends BaseController {
  _ts: TestScopedService;
  _ts2: TestTransientService;
  constructor(ts: TestScopedService, ts2: TestTransientService) {
    super("Kittens");
    this._ts = ts;
    this._ts2 = ts2;
    console.log("SCOPED", this._ts.id);
    console.log("TRANSIENT", this._ts2.id);
  }
}



Startup.ConfigureServices((services) => {
  services.AddScoped('TestScopedService', TestScopedService)
  services.AddTransient('TestTransientService', TestTransientService)
})

Startup.Configure((controllers) => {
  controllers.Add("Bananas", Bananas)
})

Startup.HandleRequest("Bananas", (controllers, prop) => {
  let c = controllers._controllers[prop]
  let i = Injector.resolve<BaseController>(c)
  i.Test()
  console.log("[SCOPED]", i);
  console.log("[TRANSIENT]", i);
})
