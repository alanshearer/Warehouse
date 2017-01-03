module Filters {

    angular.module("filters", [])
        .filter("range", ($filter: angular.IFilterService) => (data: any[], page: number, size: number) => {
            if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
                var startIndex = (page - 1) * size;
                if (data.length < startIndex) {
                    return [];
                } else {
                    var result = $filter("limitTo")(data.splice(startIndex), size);
                    return result;
                }
            } else {
                return data;
            }
        })
        .filter("pageCount", () => (data: any[], size:number) => {
            if (angular.isArray(data)) {
                var result = [];
                for (var i = 0; i < Math.ceil(data.length / size); i++) {
                    result.push(i);
                }
                return result;
            } else {
                return data;
            }
        }).filter('numberoferrors', () => (input: any) => {
            var result = {};
            var total = 0;
            recursiveCount(input.$error, input.$name, result);
            Object.keys(result).forEach(key => {
                total += result[key];
            });
            return total;
        }).filter('removeSpaces', [function () {
            return function (string) {
                if (!angular.isString(string)) {
                    return string;
                }
                return string.replace(/[\s]/g, '');
            };
        }]);

    function recursiveCount(errors: any, formName: string, result: any) {
        if (errors) {
            Object.keys(errors).forEach(key => {
                angular.forEach(errors[key], (element) => {
                    if (element) {
                        if (!angular.isDefined(element.$submitted)) {
                            if (!result[formName + '.' + element.$name + '.' + key]) {
                                result[formName + '.' + element.$name + '.' + key] = 1;
                            }
                        } else {
                            recursiveCount(element.$error, element.$name, result);
                        }
                    }
                });
            });
        }
        return result;
    }

} 