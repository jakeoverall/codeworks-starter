import { NextFunction } from "express";
import { Socket } from 'socket.io'
let expressSession = require("express-session");
let sessionstore = require("sessionstore");

export type DBTypes = "mongodb" | "couchdb" | "tingodb" | "redis" | "memcached" | "inmemory" | "elasticsearch"

export class ISerializerConfig {
  store: {
    type: DBTypes,
    host?: string
    port?: number
    dbName?: string
    collectionName?: string
    timeout?: number
    authSource?: string
    username?: string
    password?: string
    url?: string,
    dbPath?: string,
    prefix?: string
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
  socketSession: (socket: Socket, next: NextFunction) => void;
  constructor(config: ISerializerConfig) {
    this.store = this.createStore(config)
    this.middleware = this.createSession(config)
    this.socketSession = (socket, next) => {
      this.middleware(socket.request, socket.request.res, next)
    }
  }

  private createStore(config: ISerializerConfig) {
    let store = sessionstore.createSessionStore(config.store);
    store.on("error", (err) => {
      console.error("[SESSION ERROR]", err);
    });
    return store
  }

  private createSession(config: ISerializerConfig) {
    return expressSession({ ...config.session, store: this.store });
  }
}