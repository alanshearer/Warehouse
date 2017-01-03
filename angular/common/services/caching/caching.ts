module Caching {


    export interface ICachingService {
        put(key: string, value: any)
        get(key: string)
        clearAll()
    }

    angular.module("caching", ['jmdobry.angular-cache'])
        .config($angularCacheFactoryProvider => {

            // optionally set cache defaults
            $angularCacheFactoryProvider.setCacheDefaults({
                //// This cache can hold 1000 items
                //capacity: 1000,

                //// Items added to this cache expire after 15 minutes
                //maxAge: 900000,

                // Items will be actively deleted when they expire
                deleteOnExpire: 'aggressive',

                //// This cache will check for expired items every minute
                //recycleFreq: 60000,

                //// This cache will clear itself every hour
                //cacheFlushInterval: 3600000,

                //// This cache will sync itself with localStorage
                //storageMode: 'localStorage',

                //// Custom implementation of localStorage
                //storageImpl: myLocalStoragePolyfill,

                //// Full synchronization with localStorage on every operation
                //verifyIntegrity: true,

                // This callback is executed when the item specified by "key" expires.
                // At this point you could retrieve a fresh value for "key"
                // from the server and re-insert it into the cache.
                //onExpire: function (key, value) {

                //}
            });

        }).service("caching", ($angularCacheFactory: angular.ICacheFactoryService) => {

            var cache = $angularCacheFactory('applicationCache');

            return <ICachingService>{
                put: (key: string, value: any) => {
                    cache.put(key, value);
                },
                get: (key: string) => {
                    return cache.get(key);
                },
                clearAll: () => {
                    cache.removeAll();
                }
            }

        });
} 