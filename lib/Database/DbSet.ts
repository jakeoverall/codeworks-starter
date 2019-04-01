import { IRepository } from "./IRepository";
import { DbContext } from "./DbContext";
export class DbSet<T> implements IRepository<T> {
  async findById(id: string): Promise<T> {
    let client = await this.context.Client
    return await client.findById(id)
  }
  async findManyById(ids: string[]): Promise<T[]> {
    let client = await this.context.Client
    return await client.findManyById(ids)
  }
  async findOne(conditions: object): Promise<T> {
    let client = await this.context.Client
    return await client.findOne(conditions)
  }
  async find(conditions: object): Promise<T[]> {
    let client = await this.context.Client
    return client.find(conditions)
  }
  async create(record: T): Promise<T> {
    let client = await this.context.Client
    return client.create(record)
  }
  async save(record: T): Promise<T> {
    let client = await this.context.Client
    return await client.save(record)
  }
  async findOneByIdAndUpdate(id: string, record: T): Promise<T> {
    let client = await this.context.Client
    return await client.findOneByIdAndUpdate(id, record)
  }
  async findOneAndUpdate(record: T): Promise<T> {
    let client = await this.context.Client
    return await client.findOneAndUpdate(record)
  }
  async deleteOneById(id: string): Promise<T> {
    let client = await this.context.Client
    return await client.deleteOneById(id);
  }
  async deleteOne(conditions: any): Promise<T> {
    let client = await this.context.Client
    return await client.deleteOne(conditions)
  }
  async deleteMany(conditions: any): Promise<T> {
    let client = await this.context.Client
    return await client.deleteMany(conditions)
  }
  private readonly context: DbContext;
  constructor(context: DbContext) {
    this.context = context
  }
}
