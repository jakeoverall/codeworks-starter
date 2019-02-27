import express from 'express';
import { Startup } from "./Startup";

export interface IAppConfig {
  controllersPath: string
}

export class Program {
  configure: Startup;
  expressApp: express.Application;
  router: express.Router;
  constructor(config: IAppConfig = { controllersPath: 'controllers' }) {
    this.configure = new Startup()
    this.expressApp = express()
    this.configure.ControllerPath = config.controllersPath || 'controllers'
    this.router = this.configure.ControllerRoutes
  }
}

new Program({ controllersPath: "../sample/controllers" })

// class Repo {
//   find() {
//     return "Something was found"
//   }
// }

// @Service()
// class TestScopedService extends ScopedService {
//   public repo: Repo;
//   init(): void {
//     // console.log("[TEST SCOPED SERVICE]", this.id)
//   }
//   constructor(repo: Repo) {
//     super();
//     this.repo = repo
//   }
// }

// @Service()
// class TestTransientService extends BaseService {
//   init(): void {
//     // console.log("[TEST TRANSIENT SERVICE]", this.id)
//   }
// }

// @Controller("api/bananas")
// class BananasController extends BaseController {
//   _ts: TestScopedService;
//   _ts2: TestTransientService;
//   constructor(ts: TestScopedService, ts2: TestTransientService) {
//     super();
//     this._ts = ts;
//     this._ts2 = ts2;
//     // console.log("SCOPED", this._ts.id);
//     // console.log("TRANSIENT", this._ts2.id);
//   }

//   @HttpGet()
//   GetBananas(): number {
//     return 7
//   }

//   @HttpGet(":id")
//   GetBanana({ id }: any): any {
//     console.log(id, this._ts.repo.find())
//     return id
//   }

//   @HttpPut(":id")
//   @Authorize("admin")
//   EditBanana({ id }: any, body: any): any {
//     console.log("admin access only", id, body)
//     return body
//   }

//   async Test() {
//     super.Test()
//     // await this.HandleTask('should/fail')
//     await this.HandleTask("", { method: "get", params: {}, query: {} })
//     await this.HandleTask(':id', { method: "get", params: { id: "17" } })
//     await this.HandleTask(':id', { method: "put", params: { id: "21" }, body: { name: "EDITING BANANA" } })
//   }
// }