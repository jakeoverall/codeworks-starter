export interface IHttpError extends Error {
  status: number
}

export class ErrorBadRequest extends Error {
  status: number = 400
  constructor(message: string = "Bad Request") {
    super(message);
  }
}

export class ErrorUnAuthorized extends Error {
  status: number = 401
  constructor(message: string = "Not Authorized") {
    super(message);
  }
}

export class ErrorPaymentRequired extends Error {
  status: number = 402
  constructor(message: string = "Payment Required") {
    super(message);
  }
}

export class ErrorForbidden extends Error {
  status: number = 403
  constructor(message: string = "Request Denied") {
    super(message);
  }
}

export class ErrorNotFound extends Error {
  status: number = 404
  constructor(message: string = "Path does not exist") {
    super(message);
  }
}

export class ErrorServer extends Error {
  status: number = 500
  constructor(message: string = "An unexpected error occured") {
    super(message);
  }
}