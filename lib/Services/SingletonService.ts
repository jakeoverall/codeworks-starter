import BaseService from "./BaseService";

let _service: SingletonService;
export abstract class SingletonService extends BaseService {
  constructor() {
    if (_service) {
      return _service;
    }
    super()
    _service = this;
  }
}
