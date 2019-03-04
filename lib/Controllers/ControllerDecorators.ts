import BaseController, { RequestType } from "./BaseController";
import { Task } from "./Task";
import { ClassType } from "class-transformer/ClassTransformer";
import { transformAndValidate } from "class-transformer-validator";
import { guid } from "../utils/guid";
import { IController } from "./IController";

// export function Controller(path: string) {
//   return function <T extends { new(...args: any[]): {} }>(constructor: T) {
//     return class extends constructor {
//       public endpoint = '/' + path;
//       public name = constructor.name;
//       public id = guid.NewGuid()
//     }
//   }
// }

export function Controller(endpoint: string): ClassDecorator {
  return (target) => {
    // maybe do something with controller here
    target.prototype.name = target.name
    target.prototype.endpoint = '/' + endpoint
    target.prototype.id = guid.NewGuid()
    // target.prototype.methods = {}
  };
};

function HttpDecorator(method: RequestType, path: string) {
  return (target: IController, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const middleware = originalMethod.middleware || null;
    target.constructor.prototype.methods = target.constructor.prototype.methods || {}
    target.constructor.prototype.methods[key] = key
    // target.AddTask(method, path, new Task(descriptor.value))

    descriptor.value = async function (req, res) {
      try {
        this.req = this.req || req
        this.res = this.res || res
        let args = [this.req.params, this.req.body, this.req.query]
        let content = await originalMethod.apply(this, args)
        let response = { content, status: 200 }
        if (!this.res.headerSent) {
          this.res.send(response)
        }
      }
      catch (e) {
        this.res.status(e.status || 400).send({ ...e, status: e.status, message: e.message })
      }
    };

    descriptor.value.config = {
      method,
      path: path ? ('/' + path) : '',
      middleware: middleware
    };

    return descriptor;
  }
}

export let HttpGet = (path: string = ""): MethodDecorator =>
  HttpDecorator("get", path)

export let HttpPost = (path: string = ""): MethodDecorator =>
  HttpDecorator("post", path)

export let HttpPut = (path: string = ""): MethodDecorator =>
  HttpDecorator("put", path)

export let HttpDelete = (path: string = ""): MethodDecorator =>
  HttpDecorator("delete", path)


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
