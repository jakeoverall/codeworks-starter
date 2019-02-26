import { ScopedService } from "./Services/ScopedService";
import { Service } from "./Services/ServiceDecorator";
import { Injector } from "./utils/Injector";
import { Controller, HttpGet, HttpPut } from "./utils/ControllerDecorators";
import BaseService from "./Services/BaseService";
import BaseController from "./BaseController";
import { Dictionary } from "./utils/Dictionary";
import { ServiceCollection, IServiceCollection } from "./Services/IServiceCollection";
import { ConfigureAuthService, AuthMiddleware, Authorize } from "./Middleware/Authorize";


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

class Repo {
  find() {
    return "Something was found"
  }
}

@Service()
class TestScopedService extends ScopedService {
  public repo: Repo;
  init(): void {
    // console.log("[TEST SCOPED SERVICE]", this.id)
  }
  constructor(repo: Repo) {
    super();
    this.repo = repo
  }
}

@Service()
class TestTransientService extends BaseService {
  init(): void {
    // console.log("[TEST TRANSIENT SERVICE]", this.id)
  }
}

@Controller("api/bananas")
class BananasController extends BaseController {
  _ts: TestScopedService;
  _ts2: TestTransientService;
  constructor(ts: TestScopedService, ts2: TestTransientService) {
    super();
    this._ts = ts;
    this._ts2 = ts2;
    // console.log("SCOPED", this._ts.id);
    // console.log("TRANSIENT", this._ts2.id);
  }

  @HttpGet()
  GetBananas(): number {
    return 7
  }

  @HttpGet(":id")
  GetBanana({ id }: any): any {
    console.log(id, this._ts.repo.find())
    return id
  }

  @HttpPut(":id")
  @Authorize("admin")
  EditBanana({ id }: any, body: any): any {
    console.log("admin access only", id, body)
    return body
  }

  async Test() {
    super.Test()
    await this.HandleTask('should/fail')
    await this.HandleTask("", { method: "GET", params: {}, query: {} })
    await this.HandleTask(':id', { method: "GET", params: { id: "17" } })
    await this.HandleTask(':id', { method: "PUT", params: { id: "21" }, body: { name: "EDITING BANANA" } })
  }
}

Startup.ConfigureServices((services) => {
  ConfigureAuthService({
    Roles: ["public", "student", "admin", "super"],
    UserRolePath: "account.role"
  })
  // services.AddScoped('TestScopedService', TestScopedService)
  services.AddTransient('TestTransientService', TestTransientService)
})

Startup.Configure((controllers) => {
  controllers.Add("Bananas", BananasController)
})

Startup.HandleRequest("Bananas", (controllers, prop) => {
  AuthMiddleware({ account: { role: "public" } })
  let c = controllers._controllers[prop]
  let i = Injector.resolve<BaseController>(c)
  i.Test()
})
