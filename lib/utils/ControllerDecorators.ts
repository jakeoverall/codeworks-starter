import BaseController, { RequestType } from "../BaseController";
import { Task } from "./Task";
import { ClassType } from "class-transformer/ClassTransformer";
import { transformAndValidate } from "class-transformer-validator";

export const Controller = (endpoint: string): ClassDecorator => {
  return target => {
    // maybe do something with controller here
    target.prototype.name = target.name
    target.prototype.endpoint = endpoint
  };
};

function HttpDecorator(method: RequestType, routeParams: string) {
  return (target: BaseController, key: string, descriptor: PropertyDescriptor) => {
    target.AddTask(method, routeParams, new Task(descriptor.value))
  }
}

export let HttpGet = (routeParams: string = ""): MethodDecorator =>
  HttpDecorator("get", routeParams)

export let HttpPost = (routeParams: string = ""): MethodDecorator =>
  HttpDecorator("post", routeParams)

export let HttpPut = (routeParams: string = ""): MethodDecorator =>
  HttpDecorator("put", routeParams)

export let HttpDelete = (routeParams: string = ""): MethodDecorator =>
  HttpDecorator("delete", routeParams)


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

export let FromBody = (classType: ClassType<{}>): MethodDecorator => {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        args[1] = await transformAndValidate(
          classType,
          args[1],
          {
            validator: { whitelist: true },
          })

        return originalMethod.apply(this, args);
      } catch (err) {
        err.status = 400
        throw err
      }
    };
  }
}
