type CacheOptions = {
  expirationMS?: number;
  debug?: boolean;
  handlers?: CacheHandlers;
};

interface CacheHandlers {
  onItemSet?: (key: string, value: unknown) => void;
  onItemEvicted?: (key: string, value: unknown) => void;
  onItemHit?: (key: string) => void;
  onItemMiss?: (key: string) => void;
}

class PantryCache {
  expirationMS: number;
  handlers: CacheHandlers;

  _cache: Map<any, any>;
  _expirations: Map<any, any>;
  _hits: number;
  _queries: number;

  constructor(
    { expirationMS = 60 * 1000, debug = false, handlers }: CacheOptions = {},
  ) {
    this.expirationMS = expirationMS;
    this.handlers = handlers ?? {};

    this._cache = new Map();
    this._expirations = new Map();

    this._hits = 0;
    this._queries = 0;

    if (debug) {
      const interval = setInterval(() => {
        this.prettyPrint();
        this.printHitRatio();
      }, 2000);
    }
  }

  /**
   * Get the cached value for the given key, if any
   * @param key
   */
  get(key: string) {
    if (this._cache.has(key)) {
      this._hits++;
      this.handlers.onItemHit?.(key);
    } else {
      this.handlers.onItemMiss?.(key);
    }
    this._queries++;
    return this._cache.get(key);
  }

  /**
   * Set a value at the given key
   * Returns the previous value, if any
   * Also manages eviction tasks for keys
   * @param key
   * @param val
   */
  put(key: string, val: unknown, expiresInMs = this.expirationMS) {
    // clear any cleanup previously scheduled
    const taskID = this._expirations.get(key);
    if (taskID) {
      clearTimeout(taskID);
    }

    const previousValue = this._cache.get(key);
    this._cache.set(key, val);

    // set a cleanup task to evict `key` after expirationMS
    this._expirations.set(
      key,
      setTimeout(() => {
        this.handlers.onItemEvicted?.(key, this._cache.get(key));
        this._cache.delete(key);
      }, expiresInMs),
    );

    this.handlers.onItemSet?.(key, previousValue);

    return previousValue;
  }

  prettyPrint() {
    console.table(Array.from(this._cache.entries()));
  }

  printHitRatio() {
    console.log(
      `${this._hits} out of ${this._queries} queries (${this._hits /
        this._queries * 100}%)`,
    );
  }
}

export default PantryCache;
