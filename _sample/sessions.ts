import { SessionSerializer } from "../lib";

export default {
  test() {
    return new SessionSerializer({
      store: {
        type: "tingodb",
        collectionName: "Sessions",
        timeout: 10000,
        dbPath: __dirname + '/'
      },
      session: {
        secret: 'CHANGEME',
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 7 * 365 * 2,
          domain: "",
          key: ""
        }
      }
    })
  },
  mongoDb() {
    return new SessionSerializer({
      store: {
        type: "mongodb",
        url: process.env.SESSIONSTORE || 'mongodb://student:student@ds151207.mlab.com:51207/bcw-junk',
        collectionName: "Sessions"
      },
      session: {
        secret: process.env.SESSIONSECRET || 'CHANGEME',
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 7 * 365 * 2,
          domain: "",
          key: ""
        }
      }
    })
  }
}