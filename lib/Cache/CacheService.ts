import NodeCache = require('node-cache');

export class CacheService {
  cache: NodeCache;

  constructor(expireAfterSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: expireAfterSeconds,
      checkperiod: expireAfterSeconds * 0.2,
      useClones: false,
      deleteOnExpire: true
    });
  }

  async get(key: string | number, execute: () => Promise<any>) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    return execute().then((result: any) => {
      this.cache.set(key, result);
      return result;
    });
  }

  remove(keys: string | number | (string | number)[]) {
    this.cache.del(keys);
  }

  removeWhere(query: string, ignoreCase: boolean) {
    if (!query) {
      return;
    }
    if (ignoreCase) { query = query.toUpperCase() }

    const keys = this.cache.keys();
    for (let key of keys) {
      if (ignoreCase) { key = key.toUpperCase() }
      if (key.indexOf(query) != -1) {
        this.remove(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}