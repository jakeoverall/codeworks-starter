export class Task<T> extends Promise<T> {
  private __fn: Function;
  private _args: Array<any> = [];
  async Run<T>(): Promise<T> {
    try {
      return await this.__fn(...this._args);
    }
    catch (err) {
      throw err;
    }
  }
  get Result(): Promise<T> {
    try {
      return this.Run();
    } catch (err) {
      throw err
    }
  }
  BindContext(ctx: any) {
    this.__fn = this.__fn.bind(ctx);
  }
  set Args(val: Array<any>) {
    this._args = val;
  }
  constructor(fn: () => Promise<T> | T) {
    super(() => { });
    this.__fn = fn;
  }
}
