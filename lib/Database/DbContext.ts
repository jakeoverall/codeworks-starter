import { EventEmitter } from 'events';
import { ConnectionState } from "./ConnectionState";
import { IDbConnection } from "./IDbConnection";
import { DbClient } from "./DbClient";

export declare abstract class DbContext extends EventEmitter implements IDbConnection {
  abstract Client: Promise<DbClient>;
  abstract Connection: DbContext;
  abstract ConnectionString: string;
  abstract ConnectionTimeout: number;
  abstract Database: string;
  abstract State: ConnectionState;
  abstract Open(): Promise<IDbConnection>;
  abstract Close(): Promise<IDbConnection>;
}
