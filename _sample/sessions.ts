// import { SessionSerializer } from "../lib";

// export default {
//   test() {
//     return new SessionSerializer({
//       store: {
//         type: "inmemory",
//         collectionName: "Sessions",
//         timeout: 10000
//       },
//       session: {
//         secret: 'CHANGEME',
//         resave: true,
//         saveUninitialized: true,
//         cookie: {
//           maxAge: 1000 * 60 * 60 * 7 * 365 * 2,
//           domain: "",
//           key: ""
//         }
//       }
//     })
//   },
//   mongoDb() {
//     return new SessionSerializer({
//       store: {
//         type: "mongodb",
//         url: process.env.SESSIONSTORE,
//         collectionName: "Sessions"
//       },
//       session: {
//         secret: process.env.SESSIONSECRET,
//         resave: true,
//         saveUninitialized: true,
//         cookie: {
//           maxAge: 1000 * 60 * 60 * 7 * 365 * 2,
//           domain: "",
//           key: process.env.SESSIONSKEY || ""
//         }
//       }
//     })
//   }
// }