import { Db, MongoClient, ObjectID, Collection } from 'mongodb';
import * as retry from 'retry';
import { Deferred } from '../utils/Deferred';

import { ConnectionState } from "./ConnectionState";
import { DbContext } from "./DbContext";
import { IDbConnection } from "./IDbConnection";

export class MongoDbClient extends DbContext {
  Client: Promise<MongoDbClient>;
  State: ConnectionState;
  Connection: DbContext;
  ConnectionString: string;
  ConnectionTimeout: number;
  Database: string;

  async Open(): Promise<IDbConnection> {
    await this.connect(this.ConnectionString, this.client)
    return this
  }
  async Close(): Promise<IDbConnection> {
    await this.close()
    return this
  }

  private client: Promise<MongoClient>;
  private db: Promise<Db>;

  private deferredClient: Deferred<MongoClient>;
  private deferredDb: Deferred<Db>;

  async connect(uri: string, client?: MongoClient | Promise<MongoClient>): Promise<Db> {
    this.ConnectionString = uri;

    if (client !== undefined) {
      this.deferredClient.resolve(client);
    } else {
      this.deferredClient.resolve(this.createClient(this.ConnectionString));
    }

    this.deferredDb.resolve((await this.client).db());
    return this.db;
  }

  async close(): Promise<void> {
    const client = await this.client;
    return client.close();
  }

  private createClient(uri: string): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, reject) => {
      const operation = retry.operation();
      operation.attempt(async attempt => {
        try {
          const client = await MongoClient.connect(uri, { useNewUrlParser: true });
          this.emit('connected', client);
          resolve(client);
        } catch (e) {
          if (operation.retry(e)) return;
          this.emit('error', e);
          reject(e);
        }
      });
    });
  }
  constructor() {
    super()
    this.deferredClient = new Deferred<MongoClient>();
    this.client = this.deferredClient.promise;
    this.deferredDb = new Deferred<Db>();
    this.db = this.deferredDb.promise;
  }

  //SECTION REPOSITORY METHODS
  // findById(id: string): Promise<any> {
  //   return this.findOne({ _id: new ObjectID(id) });
  // }

  // async findManyById(ids: string[]): Promise<any[]> {
  //   const collection = await this.collection;
  //   const found = await collection.find({ _id: { $in: ids.map(id => new ObjectID(id)) } }).toArray();

  //   const results: DOC[] = [];
  //   for (const result of found) {
  //     results.push(await this.invokeEvents(POST_KEY, ['find', 'findMany'], this.toggleId(result, false)));
  //   }

  //   return results;
  // }

  // async findOne(conditions: object): Promise<any> {
  //   const collection = await this.collection;
  //   const cursor = collection.find(conditions).limit(1);

  //   const res = await cursor.toArray();
  //   if (res && res.length) {
  //     let document = res[0];
  //     document = this.toggleId(document, false);
  //     document = await this.invokeEvents(POST_KEY, ['find', 'findOne'], document);
  //     return document;
  //   }
  // }

  // async find(req: FindRequest = { conditions: {} }): Promise<any[]> {
  //   const collection = await this.collection;

  //   const conditions = this.toggleId(req.conditions, true);
  //   let cursor = collection.find(conditions);

  //   if (req.projection) {
  //     cursor = cursor.project(req.projection);
  //   }

  //   if (req.sort) {
  //     cursor = cursor.sort(req.sort);
  //   }

  //   if (req.skip) {
  //     cursor = cursor.skip(req.skip);
  //   }

  //   if (req.limit) {
  //     cursor = cursor.limit(req.limit);
  //   }

  //   const newDocuments = await cursor.toArray();
  //   const results = [];

  //   for (let document of newDocuments) {
  //     document = this.toggleId(document, false);
  //     document = await this.invokeEvents(POST_KEY, ['find', 'findMany'], document);
  //     results.push(document);
  //   }

  //   return results;
  // }

  // async create(document: DTO): Promise<any> {
  //   const collection = await this.collection;
  //   const eventResult: unknown = await this.invokeEvents(PRE_KEY, ['save', 'create'], document);
  //   const res = await collection.insertOne(eventResult as DOC);

  //   let newDocument = res.ops[0];
  //   newDocument = this.toggleId(newDocument, false);
  //   newDocument = await this.invokeEvents(POST_KEY, ['save', 'create'], newDocument);
  //   return newDocument;
  // }

  // async save(document: Document): Promise<any> {
  //   const collection = await this.collection;

  //   // flip/flop ids
  //   const id = new ObjectID(document.id);

  //   const updates = await this.invokeEvents(PRE_KEY, ['save'], document);
  //   delete updates['id'];
  //   delete updates['_id'];
  //   const res = await collection.updateOne({ _id: id }, { $set: updates }, { upsert: true });
  //   let newDocument = await collection.findOne({ _id: id });

  //   // project new items
  //   if (newDocument) {
  //     Object.assign(document, newDocument);
  //   }

  //   // flip flop ids back
  //   newDocument['id'] = id.toString();
  //   delete newDocument['_id'];

  //   newDocument = await this.invokeEvents(POST_KEY, ['save'], newDocument);
  //   return newDocument;
  // }

  // async findOneByIdAndUpdate(id: string, req: UpdateByIdRequest): Promise<any> {
  //   return this.findOneAndUpdate({
  //     conditions: { _id: new ObjectID(id) },
  //     updates: req.updates,
  //     upsert: req.upsert
  //   });
  // }

  // async findOneAndUpdate(req: UpdateRequest): Promise<any> {
  //   const collection = await this.collection;
  //   const updates = await this.invokeEvents(PRE_KEY, ['update', 'updateOne'], req.updates);

  //   const res = await collection.findOneAndUpdate(req.conditions, updates, {
  //     upsert: req.upsert,
  //     returnOriginal: false
  //   });

  //   let document = res.value;
  //   document = this.toggleId(document, false);
  //   document = await this.invokeEvents(POST_KEY, ['update', 'updateOne'], document);
  //   return document;
  // }

  // async deleteOneById(id: string): Promise<DeleteWriteOpResultObject> {
  //   return this.deleteOne({ _id: new ObjectID(id) });
  // }

  // async deleteOne(conditions: any): Promise<DeleteWriteOpResultObject> {
  //   const collection = await this.collection;

  //   await this.invokeEvents(PRE_KEY, ['delete', 'deleteOne'], conditions);
  //   const deleteResult = collection.deleteOne(conditions);
  //   await this.invokeEvents(POST_KEY, ['delete', 'deleteOne'], deleteResult);

  //   return deleteResult;
  // }

  // async deleteMany(conditions: any): Promise<DeleteWriteOpResultObject> {
  //   const collection = await this.collection;

  //   await this.invokeEvents(PRE_KEY, ['delete', 'deleteMany'], conditions);
  //   const deleteResult = collection.deleteMany(conditions);
  //   await this.invokeEvents(POST_KEY, ['delete', 'deleteMany'], deleteResult);

  //   return deleteResult;
  // }

  // /**
  //  * Strip off Mongo's ObjectID and replace with string representation or in reverese
  //  *
  //  * @private
  //  * @param {*} document
  //  * @param {boolean} replace
  //  * @returns {T}
  //  * @memberof MongoRepository
  //  */
  // protected toggleId(document: any, replace: boolean): DOC {
  //   if (document && (document.id || document._id)) {
  //     if (replace) {
  //       document._id = new ObjectID(document.id);
  //       delete document.id;
  //     } else {
  //       document.id = document._id.toString();
  //       delete document._id;
  //     }
  //   }
  //   return document;
  // }

  // /**
  //  * Return a collection
  //  * If the collection doesn't exist, it will create it with the given options
  //  *
  //  * @private
  //  * @returns {Promise<Collection<DOC>>}
  //  * @memberof MongoRepository
  //  */
  // private getCollection(): Promise<Collection<DOC>> {
  //   return new Promise<Collection<DOC>>(async (resolve, reject) => {
  //     const db = await this.dbSource.db;
  //     db.collection(this.options.name, { strict: true }, async (err, collection) => {
  //       let ourCollection = collection;
  //       if (err) {
  //         try {
  //           ourCollection = await db.createCollection(this.options.name, {
  //             size: this.options.size,
  //             capped: this.options.capped,
  //             max: this.options.max
  //           });
  //         } catch (createErr) {
  //           reject(createErr);
  //         }
  //       }

  //       // assert indexes
  //       if (this.options.indexes) {
  //         for (const indexDefinition of this.options.indexes) {
  //           try {
  //             await ourCollection.createIndex(indexDefinition.fields, indexDefinition.options);
  //           } catch (indexErr) {
  //             if (
  //               indexDefinition.overwrite &&
  //               indexDefinition.options.name &&
  //               indexErr.name === 'MongoError' &&
  //               (indexErr.codeName === 'IndexKeySpecsConflict' || indexErr.codeName === 'IndexOptionsConflict')
  //             ) {
  //               // drop index and recreate
  //               try {
  //                 await ourCollection.dropIndex(indexDefinition.options.name);
  //                 await ourCollection.createIndex(indexDefinition.fields, indexDefinition.options);
  //               } catch (recreateErr) {
  //                 reject(recreateErr);
  //               }
  //             } else {
  //               reject(indexErr);
  //             }
  //           }
  //         }
  //       }

  //       resolve(ourCollection);
  //     });
  //   });
  // }


  // private async invokeEvents(type: string, fns: string[], document: any): Promise<any> {
  //   for (const fn of fns) {
  //     const events = Reflect.getMetadata(`${type}_${fn}`, this) || [];
  //     for (const event of events) {
  //       document = event.bind(this)(document);
  //       if (typeof document.then === 'function') {
  //         document = await document;
  //       }
  //     }
  //   }

  //   return document;
  // }
  //!SECTION 



}