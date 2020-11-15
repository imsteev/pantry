# pantry
expiration based cache

## API

#### Initialize
```ts
const pantry = new PantryCache({
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
// returns previous value, if any
pantry.put(key: string, value: any, expiresInMS = DEFAULT_EXPIRATION)
```

#### Get
```ts
pantry.get(key: string)
```
