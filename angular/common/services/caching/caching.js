var Caching;
(function (Caching) {
    angular.module("caching", ['jmdobry.angular-cache'])
        .config(function ($angularCacheFactoryProvider) {
        // optionally set cache defaults
        $angularCacheFactoryProvider.setCacheDefaults({
            //// This cache can hold 1000 items
            //capacity: 1000,
            //// Items added to this cache expire after 15 minutes
            //maxAge: 900000,
            // Items will be actively deleted when they expire
            deleteOnExpire: 'aggressive',
        });
    }).service("caching", function ($angularCacheFactory) {
        var cache = $angularCacheFactory('applicationCache');
        return {
            put: function (key, value) {
                cache.put(key, value);
            },
            get: function (key) {
                return cache.get(key);
            },
            clearAll: function () {
                cache.removeAll();
            }
        };
    });
})(Caching || (Caching = {}));
//# sourceMappingURL=caching.js.map