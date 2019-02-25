export class HttpContext {
  private _user: Object;
  get User() {
    Object.seal(this._user);
    return this._user;
  }
}
