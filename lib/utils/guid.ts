export class guid {
  static NewGuid(): string {
    var r = (new Date()).getTime().toString(16) +
      Math.random().toString(16).substring(2) + "0".repeat(16);
    return r.substr(0, 8) + '-' + r.substr(8, 4) + '-4000-8' +
      r.substr(12, 3) + '-' + r.substr(15, 12);
  }
  constructor() {
    return guid.NewGuid()
  }
}
