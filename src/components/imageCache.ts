import type { KeyValueStore } from "../lib/indexedDbKeyValueStore"
import { getKeyValueStore } from "../lib/indexedDbKeyValueStore"

class Cache {
  cacheMap = new Map<string, string>()
  store: KeyValueStore | null

  constructor() {
    if (process.env.NODE_ENV !== "test" && globalThis.window) {
      getKeyValueStore(
        "imageCache",
        "urlToLastSeenSize",
        24 * 60 * 60 * 1000
      ).then((s) => {
        this.store = s
        s.getKeys().then((keys: string[]) => {
          keys.forEach((key) => {
            s.get(key).then((value: string) => {
              this.cacheMap.set(key, value)
            })
          })
        })
      })
    }
  }
  get(key: string) {
    return this.cacheMap.get(key)
  }
  has(key: string) {
    return this.cacheMap.has(key)
  }
  set(key: string, value: string) {
    this.cacheMap.set(key, value)
    this.store?.set(key, value)
  }
}
const imageCache = new Cache()
export default imageCache
