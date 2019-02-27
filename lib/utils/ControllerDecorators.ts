import BaseController from "../BaseController";
import { Task } from "./Task";

export const Controller = (endpoint: string): ClassDecorator => {
  return target => {
    // maybe do something with controller here
    target.prototype.name = target.name
    target.prototype.endpoint = endpoint
  };
};

export function HttpGet(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("get", routeParams, new Task(descriptor.value))
  }
}
export function HttpPost(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("post", routeParams, new Task(descriptor.value))
  }
}
export function HttpPut(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("put", routeParams, new Task(descriptor.value))
  }
}
export function HttpDelete(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("delete", routeParams, new Task(descriptor.value))
  }
}

export function Middleware(middleware: Function | Array<Function>): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args);
    };

    descriptor.value.middleware = middleware;

    return descriptor;
  }
}