import { getFromPath } from "../Extensions/Object";
import { ErrorUnAuthorized } from "../Errors/Errors";

class AuthService {
  readonly Roles: Array<string | number>;
  readonly user: any;
  readonly role: any;
  constructor(user: any, config: IAuthConfiguration) {
    this.user = user
    this.role = getFromPath(user, config.UserRolePath)
    this.Roles = config.Roles
  }

  HasAccessLevel(role: string | number = ""): boolean {
    return this.Roles.indexOf(role) <= this.Roles.indexOf(this.role)
  }

}

let __authConfig: IAuthConfiguration = {
  Roles: ["public", "user", "admin"],
  UserRolePath: "role"
}

let __clientRequest: AuthService = new AuthService({}, __authConfig)

export interface IAuthConfiguration {
  Roles: Array<string | number>
  UserRolePath?: string
}

export const ConfigureAuthService = (config: IAuthConfiguration) => {
  __authConfig = config
}

export const AuthMiddleware = (req, res, next) => {
  __clientRequest = new AuthService(req.user, __authConfig)
  next()
}

export function Authorize(role: string | number = "", nextMethod?: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any) {
      if (!__clientRequest.HasAccessLevel(role)) {
        if (nextMethod && typeof target[nextMethod] == 'function') {
          return target[nextMethod].apply(this, args)
        } else {
          throw new ErrorUnAuthorized()
        }
      }
      return method.apply(this, args);
    }
  }
}

export const User = () => {
  return __clientRequest.user
}