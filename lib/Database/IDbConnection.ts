import { ConnectionState } from "./ConnectionState";
import { DbContext } from "./DbContext";
import { DbSet } from "./DbSet";
import { MongoDbClient } from "./MongoClient";

class Course {
  id: string
  x: string
}

class CodeWorksContext extends MongoDbClient {
  public courses: DbSet<Course>

  constructor() {
    super();
  }
}

export declare interface IDbConnection {
  Connection: DbContext;
  ConnectionString: string;
  ConnectionTimeout: number;
  Database: string;
  State: ConnectionState;
  Open(): Promise<IDbConnection>;
  Close(): Promise<IDbConnection>;
}
