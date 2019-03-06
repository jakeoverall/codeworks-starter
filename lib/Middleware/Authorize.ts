import { getFromPath } from "../Extensions/Object";
import { ErrorUnAuthorized } from "../Errors/Errors";
import { RequestHandler, NextFunction } from "express-serve-static-core";
import socketIO from 'socket.io'

class AuthService {
  readonly Roles: Array<string | number>;
  readonly user: any;
  readonly role: any;
  session: any = {}
  socket: socketIO.Socket;
  constructor(user: any, config: IAuthConfiguration) {
    this.user = user
    this.role = getFromPath(user, config.UserRolePath)
    this.Roles = config.Roles
  }

  hasAccess(role: string | number = "") {
    return this.HasAccessLevel(role)
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

export const UserService = () => {
  return __clientRequest
}

export interface IAuthConfiguration {
  Roles: Array<string | number>
  UserRolePath?: string
}

export const ConfigureAuthService = (config: IAuthConfiguration) => {
  __authConfig = config
}

/**
 * To use you must have extended the express request to include req.user
 */
export const EnableAuthorizeDecorator: RequestHandler = (req, res, next) => {
  __clientRequest = new AuthService(req['user'], __authConfig)
  __clientRequest.session = req['session']
  next()
}
/**
 * To use you must have extended the socket.request to include user
 */
export const EnableAuthorizedSocket = (socket: socketIO.Socket, next: NextFunction) => {
  socket.request['authService'] = new AuthService(socket.request['user'], __authConfig)
  next()
}


export function Authorize(role: string | number = "") {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any) {
      if (!__clientRequest.HasAccessLevel(role)) {
        throw new ErrorUnAuthorized()
      }
      return method.apply(this, args);
    }
  }
}

export const User = () => {
  return __clientRequest.user
}