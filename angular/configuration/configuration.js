var Global;
(function (Global) {
    var Configuration = (function () {
        function Configuration() {
        }
        Object.defineProperty(Configuration, "serviceHost", {
            get: function () {
                return '/api/';
            },
            enumerable: true,
            configurable: true
        });
        return Configuration;
    }());
    Global.Configuration = Configuration;
    function mergeKeyValuePair(destination, source) {
        if (angular.isUndefined(source) || source == null)
            return destination;
        if (angular.isUndefined(destination) || destination == null)
            destination = new Array();
        angular.forEach(source, function (item) {
            if (!Enumerable.from(destination).any(function (r) { return r.value == item.value; })) {
                destination.push(item);
            }
        });
        //return Enumerable.from(destination).orderBy((r) => r.key).toArray();
        return Enumerable.from(destination).toArray();
    }
    Global.mergeKeyValuePair = mergeKeyValuePair;
})(Global || (Global = {}));
//# sourceMappingURL=configuration.js.map