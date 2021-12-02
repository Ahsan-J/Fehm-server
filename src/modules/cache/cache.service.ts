import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache, CachingConfig } from "cache-manager";

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheService: Cache
    ) {}

    get(key: string) {
        return this.cacheService.get(key)
    }

    set(key:string, value: string, option? : CachingConfig) {
        return this.cacheService.set(key, value, option)
    }

    del(key: string) {
        return this.cacheService.del(key)
    }

    reset() {
        return this.cacheService.reset();
    }
}