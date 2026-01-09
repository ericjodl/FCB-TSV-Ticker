// Simple in-memory cache with TTL support
interface CacheEntry<T> {
    data: T
    expiry: number
}

class InMemoryCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map()

    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return null
        }

        return entry.data as T
    }

    set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttlSeconds * 1000,
        })
    }

    clear(): void {
        this.cache.clear()
    }

    has(key: string): boolean {
        const entry = this.cache.get(key)
        if (!entry) return false
        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return false
        }
        return true
    }
}

// Singleton instance
export const cache = new InMemoryCache()
