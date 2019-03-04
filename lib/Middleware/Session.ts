let expressSession = require("express-session");
let mongoStore = require("connect-mongodb-session")(expressSession);

export class ISerializerConfig {
  store: {
    uri: string,
    collection: string
  }
  session: {
    secret: string,
    resave: boolean,
    saveUninitialized: boolean
    cookie: {
      maxAge: number,
      key: string,
      domain: string
    }
  }
}

export class SessionSerializer {
  private store: any;
  middleware: any;
  constructor(config: ISerializerConfig) {
    this.store = this.createStore(config)
    this.middleware = this.createSession(config)
  }

  private createStore(config: ISerializerConfig) {
    let store = new mongoStore(config.store);
    store.on("error", (err) => {
      console.log("[SESSION ERROR]", err);
    });
    return store
  }

  private createSession(config: ISerializerConfig) {
    return expressSession({ ...config.session, store: this.store });
  }
}