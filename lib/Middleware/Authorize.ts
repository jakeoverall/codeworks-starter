import { getFromPath } from "../Extensions/Object";
import { ErrorUnAuthorized } from "../Errors/Errors";
import { RequestHandler, NextFunction } from "express-serve-static-core";
import { Socket } from 'socket.io'

class SessionUserService {
  readonly Roles: Array<string | number>;
  readonly user: any;
  readonly role: any;
  session: any = {}
  socket: Socket;
  constructor(user: any, config: IUserSessionConfig) {
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

let __authConfig: IUserSessionConfig = {
  Roles: ["public", "user", "admin"],
  UserRolePath: "role"
}

let __clientRequest: SessionUserService = new SessionUserService({}, __authConfig)

export const SessionUser = () => {
  return __clientRequest
}

export interface IUserSessionConfig {
  Roles: Array<string | number>
  UserRolePath?: string
}

export const ConfigureSessionUserService = (config: IUserSessionConfig) => {
  __authConfig = config
}

/**
 * To use you must have extended the express request to include req.user
 */
export const EnableAuthorizeDecorator: RequestHandler = (req, res, next) => {
  __clientRequest = new SessionUserService(req['user'], __authConfig)
  __clientRequest.session = req['session']
  next()
}
/**
 * To use you must have extended the socket.request to include user
 */
export const EnableSessionUserSocket = (socket: Socket, next: NextFunction) => {
  socket.request['authService'] = new SessionUserService(socket.request['user'], __authConfig)
  next()
}

/**
 * To use EnableAuthorizeDecorator middleware when configuring the area
 * @param role
 */
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