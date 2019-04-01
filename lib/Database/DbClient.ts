import { IRepository } from "./IRepository";
export abstract class DbClient implements IRepository<any> {
  abstract findById(id: string): Promise<any>;
  abstract findManyById(ids: string[]): Promise<any[]>;
  abstract findOne(conditions: object): Promise<any>;
  abstract find(conditions: object): Promise<any[]>;
  abstract create(record: any): Promise<any>;
  abstract save(record: any): Promise<any>;
  abstract findOneByIdAndUpdate(id: string, record: any): Promise<any>;
  abstract findOneAndUpdate(req: any): Promise<any>;
  abstract deleteOneById(id: string): Promise<any>;
  abstract deleteOne(conditions: any): Promise<any>;
  abstract deleteMany(conditions: any): Promise<any>;
}
