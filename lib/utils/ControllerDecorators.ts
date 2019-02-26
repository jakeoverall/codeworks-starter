import BaseController from "../BaseController";
import { Task } from "./Task";

/**
 * Type for what object is instances of
 */
export interface Type<T> {
  new(...args: any[]): T;
}

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;

export const Controller = (endpoint: string): ClassDecorator => {
  return target => {
    target.prototype.name = target.name
    // maybe do something with controller here
    target.prototype.endpoint = endpoint
  };
};

export function HttpGet<T>(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("GET", routeParams, new Task(descriptor.value))
  }
}
export function HttpPost<T>(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("POST", routeParams, new Task(descriptor.value))
  }
}
export function HttpPut<T>(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("PUT", routeParams, new Task(descriptor.value))
  }
}
export function HttpDelete<T>(routeParams: string = ""): MethodDecorator {
  return function (target: BaseController, key: string, descriptor: PropertyDescriptor) {
    target.AddTask("DELETE", routeParams, new Task(descriptor.value))
  }
}