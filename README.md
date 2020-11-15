# pantry
expiration based cache

## API

#### Initialize
```ts
new PantryCache({
  debug?: boolean,
  expirationMS?: number,
  handlers?: {
    onItemSet?: (key: string, value: unknown) => void,
    onItemEvicted?: (key: string, value: unknown) => void,
    onItemHit?: (key: string) => void,
    onItemMiss?: (key: string) => void
  }
})
```

#### Set
```ts
pantryCache.put(key: string, value: any, expiresInMS = DEFAULT_EXPIRATION) // returns previous value, if any
```

#### Get
```ts
pantryCache.get(key: string)
```
