import { SessionSerializer } from "../lib";

export default {
  test: new SessionSerializer({
    store: {
      uri: process.env.SESSIONSTORE || 'mongodb://student:student@ds151207.mlab.com:51207/bcw-junk',
      collection: "Sessions"
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