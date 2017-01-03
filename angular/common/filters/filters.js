var Filters;
(function (Filters) {
    angular.module("filters", [])
        .filter("range", function ($filter) { return function (data, page, size) {
        if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
            var startIndex = (page - 1) * size;
            if (data.length < startIndex) {
                return [];
            }
            else {
                var result = $filter("limitTo")(data.splice(startIndex), size);
                return result;
            }
        }
        else {
            return data;
        }
    }; })
        .filter("pageCount", function () { return function (data, size) {
        if (angular.isArray(data)) {
            var result = [];
            for (var i = 0; i < Math.ceil(data.length / size); i++) {
                result.push(i);
            }
            return result;
        }
        else {
            return data;
        }
    }; }).filter('numberoferrors', function () { return function (input) {
        var result = {};
        var total = 0;
        recursiveCount(input.$error, input.$name, result);
        Object.keys(result).forEach(function (key) {
            total += result[key];
        });
        return total;
    }; }).filter('removeSpaces', [function () {
            return function (string) {
                if (!angular.isString(string)) {
                    return string;
                }
                return string.replace(/[\s]/g, '');
            };
        }]);
    function recursiveCount(errors, formName, result) {
        if (errors) {
            Object.keys(errors).forEach(function (key) {
                angular.forEach(errors[key], function (element) {
                    if (element) {
                        if (!angular.isDefined(element.$submitted)) {
                            if (!result[formName + '.' + element.$name + '.' + key]) {
                                result[formName + '.' + element.$name + '.' + key] = 1;
                            }
                        }
                        else {
                            recursiveCount(element.$error, element.$name, result);
                        }
                    }
                });
            });
        }
        return result;
    }
})(Filters || (Filters = {}));
//# sourceMappingURL=filters.js.map