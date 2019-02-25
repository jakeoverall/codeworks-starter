import { IService } from "./IService";
import { guid } from "../guid";

export default abstract class BaseService implements IService {
  public readonly id: string;
  abstract init(): void
  constructor() { this.id = guid.NewGuid(); this.init() }
}