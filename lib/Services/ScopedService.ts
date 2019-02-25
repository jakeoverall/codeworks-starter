import { SingletonService } from "./SingletonService";

export class ScopedService extends SingletonService {
  init(): void {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super()
  }
}
