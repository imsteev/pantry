class Cache {
  constructor({ expirationMS = 60 * 1000, debug = false }) {
    Cache.expirationMS = expirationMS;
    this._cache = new Map();
    this._expirations = new Map();

    this._hits = 0;
    this._queries = 0;

    if (debug) {
      const interval = setInterval(() => {
        console.log('cache:', this._cache);
        console.log(this.formatHitRatio())
      }, 2000);
    }
  }

  get(key) {
    if (this._cache.has(key)) {
      this._hits++;
    }
    this._queries++;
    return this._cache.get(key);
  }

  /**
   * Set a value at the given key
   * Returns the previous value, if any
   * Also manages eviction tasks for keys
   *
   * @param {string} key
   * @param {any} val
   */
  put(key, val) {

    // clear any cleanup previously scheduled
    const existingTimeoutID = this._expirations.get(key);
    if (existingTimeoutID) {
      clearTimeout(existingTimeoutID);
    }

    const previousValue = this._cache.get(key);
    this._cache.set(key, val);

    // set a cleanup task to evict `key` after expirationMS
    this._expirations.set(key, setTimeout(() => {
      this._cache.delete(key);
    }, Cache.expirationMS));

    return previousValue;
  }

  getHitRatio() {
    return this._hits / this._queries;
  }

  formatHitRatio() {
    return `${this._hits} out of ${this._queries} queries (${this.getHitRatio() * 100}%)`
  }
}
