export declare interface IRepository<T> {
  findById(id: string): Promise<T>;
  findManyById(ids: string[]): Promise<T[]>;
  findOne(conditions: object): Promise<T>;
  find(conditions: object): Promise<T[]>;
  create(record: T): Promise<T>;
  save(record: T): Promise<T>;
  findOneByIdAndUpdate(id: string, record: T): Promise<T>;
  findOneAndUpdate(req: T): Promise<T>;
  deleteOneById(id: string): Promise<T>;
  deleteOne(conditions: any): Promise<T>;
  deleteMany(conditions: any): Promise<T>;
}
