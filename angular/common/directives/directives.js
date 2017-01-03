var Directives;
(function (Directives) {
    angular.module("directives", ['caching', 'highcharts-ng'])
        .directive('highchartExt', function ($filter) {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                title: '@',
                data: '=',
                yAxisTitle: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                element.parent().highcharts({
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: scope.data.xAxisValues,
                    },
                    yAxis: {
                        title: {
                            text: scope.yAxisTitle
                        },
                    },
                    title: {
                        text: scope.data.header
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>'
                    },
                    legend: {
                        enabled: scope.data.showLegend
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        alert('Nome: ' + this.category + ', quantità: ' + this.y);
                                    }
                                }
                            },
                            dataLabels: {
                                enabled: scope.data.showDataLabels
                            },
                        }
                    },
                    series: scope.data.series
                });
                element.remove();
            }
        };
    })
        .directive('jqueryDaterangepicker', function () {
        return {
            restrict: 'A',
            scope: {
                startDate: '=startDate',
                endDate: '=endDate',
            },
            link: function (scope, element, attrs, ctrl) {
                element.daterangepicker({
                    startDate: scope.$eval(scope.startDate),
                    endDate: scope.$eval(scope.endDate),
                    //minDate: '01/01/2012',
                    //maxDate: '12/31/2014',
                    //dateLimit: { days: 60 },
                    /*parentEl:"#main",*/
                    timePicker: false,
                    timePickerIncrement: 1,
                    timePicker12Hour: true,
                    showDropdowns: true,
                    ranges: {
                        'Oggi': [moment(), moment()],
                        'Ieri': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Ultimi 7 giorni': [moment().subtract('days', 6), moment()],
                        'Mese corrente': [moment().startOf('month'), moment().endOf('month')],
                        'Mese precedente': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    opens: 'right',
                    buttonClasses: ['btn-sm'],
                    applyClass: 'btn-inverse',
                    cancelClass: 'btn-inverse',
                    format: 'DD/MM/YYYY',
                    separator: ' al ',
                    locale: {
                        fromLabel: 'Dal',
                        toLabel: 'al',
                        customRangeLabel: 'Intervallo personalizzato',
                        daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
                        monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                        firstDay: 1
                    }
                }, function (start, end) {
                    scope.$apply(function () {
                        scope.startDate = start._d;
                        scope.endDate = end._d;
                    });
                    //console.log("Callback has been called!");
                    //  element.html(start + ' - ' + end);
                });
            }
        };
    })
        .directive('jqueryColorpicker', function ($parse) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                var e = element;
                var id = "color_" + element.attr('name');
                var data = e.data();
                var submitBtn = data.inline ? 0 : 1;
                e.attr("id", id);
                if (data.addon && e.is("input")) {
                    $('#' + id).next().css("width", e.outerHeight());
                }
                e.colpick({
                    bornIn: "body",
                    flat: data.inline || false,
                    submit: submitBtn,
                    layout: data.layout || 'hex',
                    color: e.val(),
                    colorScheme: data.theme || "gray",
                    onChange: function (hsb, hex, rgb) {
                        $('#' + id).val('#' + hex);
                        if (data.addon) {
                            $('#' + id).css({ 'border-color': '#' + hex });
                            $('#' + id).next().css({ 'background-color': '#' + hex, 'border-color': '#' + hex });
                        }
                        return scope.$apply(function () { return ctrl.$setViewValue('#' + hex); });
                    },
                    onSubmit: function (hsb, hex, rgb, el) {
                        $(el).val('#' + hex);
                        $(el).colpickHide();
                        return scope.$apply(function () { return ctrl.$setViewValue('#' + hex); });
                    }
                });
                scope.$watch(attrs['ngModel'], function (newvalue) {
                    if (angular.isDefined(newvalue) && newvalue.length > 0) {
                        var hex = newvalue.substring(1);
                        $('#' + id).css({ 'border-color': '#' + hex });
                        $('#' + id).next().css({ 'background-color': '#' + hex, 'border-color': '#' + hex });
                    }
                });
            }
        };
    })
        .directive('jqueryDateinputmask', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var creditCard = attrs["creditcard"] || "false";
                var format = creditCard == "true" ? "m/y" : "d/m/y";
                var placeholder = creditCard == "true" ? "__/____" : "__/__/____";
                element.inputmask(format, { "clearIncomplete": true, "placeholder": placeholder });
                if (ctrl) {
                    ctrl.$parsers.push(function (value) {
                        if (value != null && value != '') {
                            var parts = value.split('/');
                            if (creditCard == "true") {
                                return new Date(parseInt(parts[1]), parseInt(parts[0]) - 1, 1); // Note: months are 0-based
                            }
                            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); // Note: months are 0-based
                        }
                        return null;
                    });
                    ctrl.$formatters.push(function (d) {
                        if (angular.isDefined(d) && d != null) {
                            if (creditCard == "true") {
                                return ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
                            }
                            return ('00' + d.getDate()).slice(-2) + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
                        }
                        return "";
                    });
                }
            }
        };
    })
        .directive('jqueryDatetimeinputmask', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                element.inputmask("datetime", { "clearIncomplete": true, "placeholder": "__/__/____ __:__" });
                if (ctrl) {
                    ctrl.$parsers.push(function (value) {
                        if (value != null && value != '') {
                            var mainparts = value.split(' ');
                            var dateparts = mainparts[0].split('/');
                            var timeparts = mainparts[1].split(':');
                            return new Date(parseInt(dateparts[2]), parseInt(dateparts[1]) - 1, parseInt(dateparts[0]), parseInt(timeparts[0]), parseInt(timeparts[1])); // Note: months are 0-based
                        }
                        return null;
                    });
                    ctrl.$formatters.push(function (d) {
                        if (angular.isDefined(d) && d != null) {
                            return ('00' + d.getDate()).slice(-2) + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2);
                        }
                        return "";
                    });
                }
            }
        };
    })
        .directive('jqueryTimeinputmask', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                element.inputmask('h:s', { "clearIncomplete": true, "placeholder": "__:__" });
                if (ctrl) {
                    ctrl.$parsers.push(function (value) {
                        if (value != null && value != '') {
                            var parts = value.split(':');
                            var currentDate = new Date();
                            var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), parseInt(parts[0]), parseInt(parts[1]));
                            return date;
                        }
                        return null;
                    });
                    ctrl.$formatters.push(function (d) {
                        if (angular.isDefined(d) && d != null) {
                            return ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2);
                        }
                        return "";
                    });
                }
            }
        };
    })
        .directive('countrySelector', function ($http, $log, $q) {
        return {
            templateUrl: '/common/directives/templates/countrySelector.html',
            restrict: 'E',
            scope: {
                municipalityId: '=municipalityId',
                municipalityName: '=municipalityName',
                countryId: '=countryId',
                countryName: '=countryName',
                provinceId: '=provinceId',
                provinceName: '=provinceName',
                postalcode: '=?',
                disabled: '=ngDisabled',
                required: '=ngRequired',
                showpostalcode: '@showpostalcode'
            },
            link: function (scope, element, attrs, ctrl) {
                scope.municipalities = [];
                scope.provinces = [];
                scope.countries = [{ key: 'ITALIA', value: 126 }];
                if (scope.countryId == null) {
                    scope.countryId = scope.countries[0].value;
                }
                scope.getCountries = function () {
                    $http.get(Global.Configuration.serviceHost + 'municipalities/countries', { cache: true }).success(function (result) {
                        scope.countries = result;
                    }).catch(function (error) { $log.error(error); });
                };
                scope.changeCountry = function () {
                    scope.provinces = [];
                    scope.provinceId = null;
                    scope.provinceName = null;
                    scope.municipalities = [];
                    scope.municipalityId = null;
                    scope.municipalityName = null;
                    scope.postalcode = null;
                };
                scope.changeProvince = function () {
                    scope.municipalities = [];
                    scope.municipalityId = null;
                    scope.municipalityName = null;
                    scope.postalcode = null;
                };
                scope.changeMunicipality = function (mId) {
                    scope.postalcode = null;
                    if (mId > 0) {
                        $http.get(Global.Configuration.serviceHost + 'municipalities/' + mId, { cache: true }).success(function (result) {
                            scope.postalcode = result.postalCode;
                        }).catch(function (error) { $log.error(error); });
                    }
                };
                scope.getProvinces = function () {
                    //scope.municipalities = [];
                    if (angular.isDefined(scope.countryId) && scope.countryId > 0) {
                        $http.get(Global.Configuration.serviceHost + 'municipalities/provinces/' + scope.countryId, { cache: true }).success(function (result) {
                            scope.provinces = result;
                        }).catch(function (error) { $log.error(error); });
                    }
                };
                scope.getMunicipalities = function () {
                    if (angular.isDefined(scope.provinceId) && scope.provinceId > 0) {
                        $http.get(Global.Configuration.serviceHost + 'municipalities/summary/' + scope.provinceId, { cache: true }).success(function (result) {
                            scope.municipalities = result;
                        }).catch(function (error) { $log.error(error); });
                    }
                };
                scope.$watch('countryId', function (newValue) {
                    if (newValue != null && scope.countryName != null && scope.countries.length == 1) {
                        scope.countries.push({ value: newValue, key: scope.countryName });
                    }
                });
                scope.$watch('provinceId', function (newValue) {
                    if (newValue != null && scope.provinceName != null && scope.provinces.length == 0) {
                        scope.provinces.push({ id: newValue, name: scope.provinceName, region: '' });
                    }
                });
                scope.$watch('municipalityId', function (newValue) {
                    if (newValue != null && scope.municipalityName != null && scope.municipalities.length == 0) {
                        scope.municipalities.push({ value: newValue, key: scope.municipalityName });
                    }
                });
            }
        };
    })
        .directive('sorter', function () {
        return {
            restrict: 'A',
            require: '^paginator',
            link: function (scope, element, attrs, ctrl) {
                var sortName = attrs['sorter'];
                if (sortName != '') {
                    element.addClass('sorting');
                    element.on('click', function (event) {
                        var tdIndex;
                        element.closest('tr').find('th').each(function (idx, e) {
                            if (!element.is(e)) {
                                $(e).removeClass('sorting_asc').removeClass('sorting_desc');
                            }
                            else {
                                tdIndex = idx;
                            }
                        });
                        if (element.hasClass('sorting_asc')) {
                            element.removeClass('sorting_asc').addClass('sorting_desc');
                        }
                        else {
                            element.removeClass('sorting_desc').addClass('sorting_asc');
                        }
                        ctrl.setSorter(sortName);
                    });
                }
            }
        };
    }).directive('formSubmit', function (notification, $filter) {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, element, attrs, form) {
                if (attrs["novalidate"] == undefined)
                    attrs.$set('novalidate', 'novalidate');
                element.bind('submit', function (e) {
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.submitted = true;
                        scope.$broadcast('submitted');
                    });
                    // Get the form object.
                    if (form.$valid) {
                        // If the form is valid call the method specified
                        scope.$eval(attrs['formSubmit']);
                        return;
                    }
                    else {
                        //var errors = $filter('numberoferrors')(form);
                        notification.showError('Attenzione non è possibile continuare perchè ci sono alcuni errori di validazione.');
                    }
                });
            }
        };
    }).directive('formErrorsCount', function ($log, $filter, $compile) {
        return {
            restrict: 'A',
            scope: {
                formErrorsCount: '@'
            },
            link: function (scope, element, attrs) {
                scope.isDirty = false;
                scope.$on('submitted', function (event, args) {
                    scope.submitted = true;
                });
                scope.$watch('formErrorsCount', function (formName) {
                    if (formName) {
                        var targetScope = findScope(formName, scope);
                        if (targetScope) {
                            targetScope.$watch(formName + '.$dirty', function (dirty) {
                                scope.dirty = dirty;
                            });
                            targetScope.$watch(formName + '.$invalid', function (invalid) {
                                scope.invalid = invalid;
                            });
                            targetScope.$watch(formName + '.$error', function (errors) {
                                scope.errorCount = $filter('numberoferrors')(targetScope[formName]);
                                //$log.info(form.$name + ' --> ' + scope.errorCount);
                                if (scope.errorCount > 0) {
                                    element.closest('[data-toggle="tab"]').addClass('tab-error');
                                }
                                else {
                                    element.closest('[data-toggle="tab"]').removeClass('tab-error');
                                }
                            }, true);
                            var spanElement = $compile('<span data-ng-show="(dirty || submitted) && invalid" class="badge bg-danger fx-fade-left fx-easing-elastic"><b>{{errorCount}}</b></span>')(scope);
                            element.append(spanElement);
                        }
                    }
                });
                function findScope(formName, targetScope) {
                    if (formName) {
                        if (targetScope[formName] != null) {
                            return targetScope;
                        }
                        return findScope(formName, targetScope.$parent);
                    }
                    return null;
                }
            }
        };
    })
        .directive('paginator', function ($resource, dateFilter, $interval, caching) {
        return {
            templateUrl: function (element, attrs) {
                return attrs['small'] == 'true'
                    ? '/common/directives/templates/paginatorsmall.html' :
                    '/common/directives/templates/paginator.html';
            },
            restrict: 'E',
            transclude: true,
            scope: {
                pageSize: '@',
                resourceUrl: '@',
                pageCount: '=?',
                items: '=',
                totalItems: '=',
                currentPage: '=?',
                filters: '=?',
                cachekey: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                var resource = $resource(scope.resourceUrl + ':pageIndex/:pageSize/:sortBy/:ascending', { pageIndex: '@pageIndex', pageSize: '@pageSize', ascending: '@ascending', sortBy: '@sortBy' });
                scope.currentPage = 1;
                if (angular.isUndefined(scope.pageSize)) {
                    scope.pageSize = "10";
                }
                var stop;
                var requestParamsFromCache = null;
                if (angular.isDefined(scope.cachekey)) {
                    var filtersFromCache = caching.get(scope.cachekey + '_filters');
                    if (angular.isDefined(filtersFromCache))
                        scope.filters = filtersFromCache;
                    requestParamsFromCache = caching.get(scope.cachekey + '_requestparams');
                }
                scope.$watch('filters', function (newValue) {
                    if (angular.isDefined(stop)) {
                        $interval.cancel(stop);
                    }
                    stop = $interval(function () { scope.selectPage(1); $interval.cancel(stop); }, 500);
                }, true);
                scope.changePageSize = function (pageSize) {
                    scope.pageSize = pageSize;
                    scope.selectPage(1);
                };
                scope.selectPage = function (page) {
                    scope.currentPage = page;
                    var requestParams = {};
                    if (requestParamsFromCache != null) {
                        angular.copy(requestParamsFromCache, requestParams);
                        scope.pageSize = requestParams['pageSize'];
                        scope.currentPage = requestParams['pageIndex'];
                        scope.sorter = requestParams['sortBy'];
                        requestParamsFromCache = null;
                    }
                    else {
                        requestParams = {
                            pageSize: scope.pageSize,
                            pageIndex: page,
                            sortBy: scope.sorter,
                            ascending: scope.ascending
                        };
                    }
                    if (angular.isDefined(scope.cachekey)) {
                        caching.put(scope.cachekey + '_filters', scope.filters);
                        caching.put(scope.cachekey + '_requestparams', requestParams);
                    }
                    if (angular.isDefined(scope.filters) && angular.isObject(scope.filters)) {
                        angular.forEach(scope.filters, function (value, key) {
                            var requestValue = value;
                            if (angular.isDate(requestValue)) {
                                requestValue = value;
                            }
                            else if (requestValue && value && typeof (value) === 'object')
                                requestValue = value.value;
                            requestParams[key] = requestValue;
                        });
                    }
                    resource.get(requestParams, function (result) {
                        scope.items = result.items;
                        scope.totalItems = result.total;
                        scope.pageCount = (angular.isDefined(scope.totalItems)) ? Math.ceil(scope.totalItems / parseInt(scope.pageSize)) : 0;
                    });
                };
            },
            controller: function ($scope) {
                this.setSorter = function (sorter) {
                    if (sorter != '') {
                        if (angular.isUndefined($scope.sorter) || sorter != $scope.sorter) {
                            $scope.ascending = true;
                        }
                        else {
                            $scope.ascending = !$scope.ascending;
                        }
                        $scope.sorter = sorter;
                        $scope.selectPage(1);
                    }
                };
                this.setFilters = function (filters) {
                    if (angular.isArray(filters)) {
                        angular.copy(filters, $scope.filters);
                        $scope.selectPage(1);
                    }
                };
            }
        };
    })
        .directive('checkboxList', function () {
        return {
            templateUrl: '/common/directives/templates/checkboxList.html',
            restrict: 'AE',
            scope: {
                sourceItems: '=sourceItems',
                destinationItems: '=destinationItems',
                itemPropertyname: '@itemPropertyname',
                itemPropertyvalue: '@itemPropertyvalue',
                itemPropertyselected: '@itemPropertyselected'
            },
            link: function (scope, element, attrs) {
                scope.$watch('sourceItems', function () { performanceSelected(); });
                scope.$watch('destinationItems', function () { performanceSelected(); });
                scope.selectedChanged = function (item) {
                    scope.destinationItems = [];
                    scope.sourceItems
                        .filter(function (itemSource) { return itemSource[scope.itemPropertyselected] == true; })
                        .forEach(function (r) { scope.destinationItems.push(r[scope.itemPropertyvalue]); });
                };
                function performanceSelected() {
                    if (angular.isDefined(scope.destinationItems) && angular.isDefined(scope.sourceItems)) {
                        scope.destinationItems.forEach(function (itemDestination) {
                            scope.sourceItems
                                .filter(function (itemSource) { return itemSource[scope.itemPropertyvalue] == itemDestination; })
                                .forEach(function (item) { item[scope.itemPropertyselected] = true; });
                            ;
                        });
                    }
                }
            }
        };
    })
        .directive('jqueryDatepicker', function (dateFilter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                element.datetimepicker({
                    language: 'it',
                    bornIn: "body",
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    showMeridian: 2,
                    minView: 2,
                    maxView: 2,
                    forceParse: true,
                    format: "dd/mm/yyyy"
                });
                scope.$watch(attrs['ngModel'], function (newValue) {
                    if (angular.isDefined(newValue)) {
                        var requestValue = dateFilter(newValue, 'dd/MM/yyyy');
                        element.val(requestValue);
                        element.datetimepicker('update');
                    }
                });
                if (ctrl) {
                    ctrl.$parsers.push(function (value) {
                        if (value != null && value != '') {
                            var parts = value.split('/');
                            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); // Note: months are 0-based
                        }
                        return null;
                    });
                    ctrl.$formatters.push(function (d) {
                        if (angular.isDefined(d) && d != null) {
                            return ('00' + d.getDate()).slice(-2) + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
                        }
                        return "";
                    });
                }
            }
        };
    })
        .directive('jqueryPopover', function (dateFilter) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.popover({ html: true, animation: true });
                attrs.$observe('content', function (content) {
                    if (content != null && content != "") {
                        element.popover('destroy').popover({ html: true, animation: true }).focus();
                    }
                });
            }
        };
    })
        .directive('jqueryTooltip', function (dateFilter) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                attrs.$observe('title', function (content) {
                    if (content != null && content != "") {
                        element.tooltip();
                    }
                });
            }
        };
    })
        .directive('jqueryPopup', function (dateFilter, notification, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    var title = attrs.title ? attrs.title : attrs.originalTitle;
                    notification.showInformation(title);
                });
            }
        };
    })
        .directive('jqueryProgressbar', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.progressbar();
                attrs.$observe('ariaValuetransitiongoal', function (content) { check(content); });
                attrs.$observe('ariaValuemax', function (content) { check(content); });
                function check(content) {
                    if (content != null && content != "") {
                        element.progressbar("destroy").progressbar();
                    }
                }
            }
        };
    })
        .directive('jqueryDatetimepicker', function (dateFilter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs) {
                element.datetimepicker({
                    language: 'it',
                    bornIn: "body",
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    showMeridian: 2,
                    forceParse: true,
                    format: "dd/mm/yyyy hh:ii"
                });
                scope.$watch(attrs['ngModel'], function (newValue) {
                    if (angular.isDefined(newValue)) {
                        var requestValue = dateFilter(newValue, 'dd/MM/yyyy HH:mm');
                        element.val(requestValue);
                        element.datetimepicker('update');
                    }
                });
            }
        };
    })
        .directive('jquerySelectpicker', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var e = element;
                if (angular.isDefined(attrs['ngOptions'])) {
                    var ngOptionsPart = attrs['ngOptions'].split(/[|]+/).filter(function (item) {
                        return item.indexOf(' in ') > 0;
                    }).pop();
                    var scopeCollection = ngOptionsPart.split(/[ ]+/).filter(function (item) {
                        return item != '';
                    }).pop();
                    scope.$watch(scopeCollection, function () {
                        refresh(e);
                    }, true);
                }
                scope.$watch(attrs['ngModel'], function () {
                    refresh(e);
                });
                if (attrs['ngDisabled'] != null) {
                    scope.$watch(attrs['ngDisabled'], function (newValue) {
                        $(e).prop('disabled', newValue);
                        refresh(e);
                    });
                }
                function refresh(e) {
                    $(e).selectpicker('refresh');
                }
            }
        };
    })
        .directive('jquerySelectpickerLive', function () {
        return {
            restrict: 'A',
            scope: { jquerySelectpickerLive: '&' },
            link: function (scope, element, attrs) {
                $(element).selectpicker('refresh');
                element.parent().find('button').on('click', function () { scope.jquerySelectpickerLive(); });
                if (angular.isDefined(attrs['ngOptions'])) {
                    var ngOptionsPart = attrs['ngOptions'].split(/[|]+/).filter(function (item) { return item.indexOf(' in ') > 0; }).pop();
                    var scopeCollection = ngOptionsPart.split(/[ ]+/).filter(function (item) { return item != ''; }).pop();
                    scope.$parent.$watch(scopeCollection, function () { $(element).selectpicker('refresh'); });
                }
                scope.$parent.$watch(attrs['ngModel'], function (newValue) {
                    $(element).selectpicker('refresh');
                });
                if (attrs['ngDisabled'] != null) {
                    scope.$parent.$watch(attrs['ngDisabled'], function (newValue) {
                        $(element).prop('disabled', newValue);
                        $(element).selectpicker('refresh');
                    });
                }
            }
        };
    })
        .directive('kvpSelect', function () {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/templates/kvpSelect.html',
            scope: {
                items: '=',
                current: '=',
                action: '&',
                required: '=?',
                disabled: '=?',
                change: '&?',
                width: '@?',
                selectStyle: '@?'
            },
            link: function (scope, element, attrs) {
                scope.$watch('current', function (item) {
                    if (item) {
                        //Commentato per evitare ordinamento mesi in ordine alfabetico - DA VERIFICARE
                        scope.items = Global.mergeKeyValuePair(scope.items, [item]);
                    }
                });
                scope.getItems = function () {
                    if (scope.action) {
                        scope.action(scope.item).success(function (result) {
                            var itemsToMerge = [];
                            angular.copy(result, itemsToMerge);
                            if (result && result.length > 0) {
                                if (result[0].id) {
                                    itemsToMerge = [];
                                    angular.forEach(result, function (item) {
                                        itemsToMerge.push({ key: item.name, value: item.id });
                                    });
                                }
                            }
                            scope.items = Global.mergeKeyValuePair(scope.items, itemsToMerge);
                        });
                    }
                };
            }
        };
    }).directive('ignoreDirty', [function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$pristine = false;
                }
            };
        }])
        .directive('jqueryIcheck', function ($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var data = element.data();
                return $timeout(function () {
                    var value;
                    value = attrs['value'];
                    scope.$watch(attrs['ngModel'], function (newValue) {
                        $(element).iCheck('update');
                    });
                    if (angular.isDefined(attrs['ngDisabled'])) {
                        scope.$watch(attrs['ngDisabled'], function (newValue) {
                            $(element).iCheck('update');
                        });
                    }
                    if (angular.isDefined(attrs['ngChecked'])) {
                        scope.$watch(attrs['ngChecked'], function (newValue) {
                            $(element).iCheck('update');
                        });
                    }
                    return $(element).iCheck({
                        checkboxClass: data.checkboxclass || 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green'
                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && attrs['ngModel']) {
                            scope.$apply(function () { return ngModel.$setViewValue(event.target.checked); });
                        }
                        if ($(element).attr('type') === 'radio' && attrs['ngModel']) {
                            return scope.$apply(function () { return ngModel.$setViewValue(value); });
                        }
                        //return scope.$apply(() => ngModel.$setViewValue(value));
                    });
                });
            }
        };
    })
        .directive('tabbablesections', function ($http, $log, $window, $interval) {
        return {
            restrict: 'A',
            scope: {
                tabbablesections: '='
            },
            link: function (scope, element, attrs) {
                var uuid = generateUuid();
                scope.tabbablesections =
                    {
                        tabs: [],
                        currentTab: 0
                    };
                $(element).find('.tab-pane').each(function (index, ele) {
                    $(ele).attr('id', 'tab' + uuid + index);
                    if (scope.tabbablesections.currentTab === index)
                        $(ele).addClass('in active');
                });
                $(element).find('ul > li > a').each(function (index, e) {
                    var sectionName = $(e).find('section-modify').data('sectionname');
                    //if (sectionName == null) {
                    //    $log.error('Attenzione non è stato possibile recuperare il nome della sezione da associare al link del TAB. Indice TAB: ' + index);
                    //    return;
                    //}
                    if (scope.tabbablesections.tabs[index] == null)
                        scope.tabbablesections.tabs[index] = {};
                    scope.tabbablesections.tabs[index].sectionName = sectionName;
                    $(e).parent().removeClass('in active');
                    if (scope.tabbablesections.currentTab === index) {
                        $(e).parent().addClass('in active');
                        scope.tabbablesections.tabs[index].loaded = true;
                    }
                    $(e).addClass('uppercase').attr('data-target', '#tab' + uuid + index).attr('data-toggle', 'tab').attr('href', 'javascript:void(0)').on('click', function (ele) {
                        scope.$apply(function () {
                            scope.tabbablesections.tabs[index].loaded = true;
                            scope.tabbablesections.currentTab = index;
                        });
                    });
                });
            }
        };
    })
        .directive('jqueryChart', function () {
        return {
            restrict: 'A',
            scope: {
                data: '=data',
                options: '=options'
            },
            link: function (scope, element, attrs) {
                scope.$parent.$watch(attrs['data'], function (newValue) {
                    $.plot(element, newValue, scope.options);
                });
            }
        };
    })
        .directive('entityInformation', function ($http) {
        return {
            restrict: 'E',
            templateUrl: '/common/directives/templates/_entityInformation.html',
            scope: {
                entity: '='
            },
            link: function (scope, element, attrs) {
            }
        };
    })
        .directive('jqueryEasychart', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var thisEasy = element;
                var $data = element.data();
                $data.barColor = $.fillColor(thisEasy) || "#6CC3A0";
                $data.size = $data.size || 119;
                $data.trackColor = $data.trackColor || "#EEE";
                $data.lineCap = $data.lineCap || "butt";
                $data.lineWidth = $data.lineWidth || 20;
                $data.scaleColor = $data.scaleColor || false,
                    $data.onStep = function (from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    };
                thisEasy.find('.percent').css({ "line-height": $data.size + "px" });
                thisEasy.easyPieChart($data);
            }
        };
    })
        .directive('jqueryMmenu', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var data = element.data();
                element.mmenu({
                    //searchfield: {
                    //    placeholder: "Cerca",
                    //    search: true,
                    //    noResults: 'Nessun risultato',
                    //    add: true
                    //},
                    searchfield: false,
                    slidingSubmenus: true
                }, { pageSelector: "#wrapper" }).on("closiangular.mm", function () {
                    var highest = $(this).find("ul.mm-highest");
                    highest.find(".mm-subclose").trigger('click');
                });
                element.find('a[href^="/"]').each(function (index, e) {
                    $(e).click(function () {
                        element.trigger('close.mm');
                    });
                });
                var elementId = element.attr('id');
                if (elementId != '') {
                    var wrapper = Hammer(document.getElementById(elementId));
                    wrapper.on("dragright", function (event) {
                        if ((event.gesture.deltaY <= 7 && event.gesture.deltaY >= -7) && event.gesture.deltaX > 100) {
                            $('nav#menu').trigger('open.mm');
                        }
                    });
                    wrapper.on("dragleft", function (event) {
                        if ((event.gesture.deltaY <= 5 && event.gesture.deltaY >= -5) && event.gesture.deltaX < -100) {
                            $('nav#contact-right').trigger('open.mm');
                        }
                    });
                }
            }
        };
    })
        .directive('ngForm', function () {
        return {
            restrict: 'EA',
            require: 'form',
            link: function (scope, elem, attrs, formCtrl) {
                scope.$on('submitted', function () {
                    formCtrl.$setSubmitted();
                });
            }
        };
    })
        .directive('formGroup', function ($compile, $timeout) {
        return {
            restrict: 'A',
            require: "^form",
            templateUrl: function (element, attrs) {
                return element.is('td') ? '/common/directives/templates/formTableField.html' :
                    '/common/directives/templates/formGroup.html';
            },
            replace: true,
            transclude: true,
            scope: true,
            link: function (scope, element, attrs, formController, transclude) {
                var currentScope = scope;
                transclude(scope.$parent, function (content) {
                    element.find('[data-transclude]').prepend(content);
                });
                var inputs = element.find(":input[data-ng-model], :input[ng-model]");
                var inputNames = [];
                var submitExpression = [formController.$name, "$submitted"].join(".");
                var invalidExpression = '', dirtyExpression = '';
                scope.forLabel = '_';
                scope.isInvalid = scope.isDirty = scope.isSubmitted = false;
                scope.label = attrs['label'];
                scope.labelClass = attrs['labelClass'];
                scope.left = attrs['left'] || 4;
                scope.right = attrs['right'] || 8;
                scope.customErrorMessage = attrs['customErrorMessage'];
                scope.getRightClass = function () {
                    //col-md-{{right}} label != null ? '': 'col-md-offset-{{left}}'
                    var _class = 'col-md-' + scope.right;
                    if (scope.label == null && scope.left != null)
                        _class += 'col-md-offset-' + scope.left;
                    var hForm = $(element).closest('form.form-horizontal');
                    if (hForm.length == 0)
                        _class = null;
                    return _class;
                };
                scope.getLeftClass = function () {
                    //class="control-label {{labelClass}} col-md-{{left}}" 
                    var _class = 'control-label ' + scope.labelClass + ' col-md-' + scope.left;
                    var hForm = $(element).closest('form.form-horizontal');
                    if (hForm.length == 0)
                        _class = null;
                    return _class;
                };
                //if (inputs.length == 0) {
                //    console.warn(element);
                //}
                for (var i = 0; i < inputs.length; i++) {
                    var input = $(inputs[i]);
                    scope.forLabel = '_';
                    var inputName = (input.attr('name')).replace(/\{\{\$index\}\}/g, scope.$index);
                    if (inputNames.indexOf(inputName) < 0) {
                        inputNames.push(inputName);
                        var invalidExp = [formController.$name, inputName, "$invalid"].join(".");
                        var dirtyExp = [formController.$name, inputName, "$dirty"].join(".");
                        var errorExp = [formController.$name, inputName, "$error"].join(".");
                        if (angular.isUndefined(input.attr("id"))) {
                            input.attr("id", generateUuid());
                        }
                        scope.forLabel = input.attr("id");
                        var ele = angular.element('<label class="help-block" data-ng-show="' + invalidExp + ' && (' + dirtyExp + ' || ' + submitExpression + ')"><span for="' + scope.forLabel + '" class="color bg-danger-darken uppercase"> {{getError(' + errorExp + ',"' + scope.label + '")}} </span></label>');
                        element.find('div').first().append(ele);
                        $compile(ele)(scope);
                        scope.isRequired = angular.isDefined(input.attr('required'));
                        var requiredExpression = input.attr('ng-required') || input.data('ng-required');
                        if (angular.isDefined(requiredExpression)) {
                            currentScope.$watch(requiredExpression, function (required) {
                                scope.isRequired = required;
                            });
                        }
                        if (invalidExpression != '')
                            invalidExpression += ' || ';
                        invalidExpression += invalidExp;
                        if (dirtyExpression != '')
                            dirtyExpression += ' || ';
                        dirtyExpression += dirtyExp;
                    }
                }
                currentScope.$watch(invalidExpression, function (newvalue) {
                    scope.isInvalid = newvalue;
                });
                currentScope.$watch(dirtyExpression, function (newvalue) {
                    scope.isDirty = newvalue;
                });
                currentScope.$watch(submitExpression, function (newvalue) {
                    scope.isSubmitted = newvalue;
                });
                scope.getError = function (error, label) {
                    if (angular.isUndefined(label) || label == 'undefined')
                        label = '';
                    if (angular.isDefined(scope.customErrorMessage) && scope.customErrorMessage != "") {
                        return scope.customErrorMessage;
                    }
                    var errorMessage = 'Campo ' + label + ' non valido';
                    if (angular.isDefined(error)) {
                        if (error.required) {
                            errorMessage = 'Campo ' + label + ' obbligatorio';
                        }
                        if (error.email) {
                            errorMessage = 'Indirizzo e-mail non valido';
                        }
                        if (error.url) {
                            errorMessage = 'Indirizzo internet non valido';
                        }
                        if (error.number) {
                            errorMessage = 'Indicare un valore numerico';
                        }
                        if (error.max || error.min) {
                            errorMessage = 'Valore non compreso nel range di valori disponibili';
                        }
                        if (error.pattern) {
                            errorMessage = attrs['patternMessage'] || 'Campo non valido';
                        }
                        if (error.compare) {
                            errorMessage = 'I campi non coincidono';
                        }
                        if (error.maxlength) {
                            errorMessage = 'Valore troppo lungo';
                        }
                    }
                    ;
                    return errorMessage;
                };
            }
        };
    })
        .directive('handleClose', function () {
        return {
            scope: {
                handleClose: '&'
            },
            link: function (scope, elem, attrs) {
                window.onbeforeunload = function () {
                    if (angular.isDefined(scope.handleClose)) {
                        scope.handleClose();
                    }
                    return '';
                };
                scope.$on('$locationChangeStart', function (event, next, current) {
                    if (angular.isDefined(scope.handleClose)) {
                        scope.handleClose();
                    }
                    return true;
                });
            }
        };
    })
        .directive('formAutofillFix', function ($timeout) { return function (scope, element, attrs) {
        element.prop('method', 'post');
        if (attrs.ngSubmit) {
            $timeout(function () {
                element
                    .unbind('submit')
                    .bind('submit', function (event) {
                    event.preventDefault();
                    element
                        .find('input, textarea, select')
                        .trigger('input')
                        .trigger('change')
                        .trigger('keydown');
                    scope.$apply(attrs.ngSubmit);
                });
            });
        }
    }; }).directive('downloadFile', function ($log) {
        return {
            restrict: 'A',
            scope: {
                downloadFile: '&',
                downloadFileName: '@downloadFileName',
                downloadFileType: '@downloadFileType'
            },
            link: function (scope, element, attrs) {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                element.on('click', function () {
                    scope.downloadFile().then(function (data) {
                        var blob = new Blob([data], { type: scope.downloadFileType || 'application/octet-stream' });
                        var urlCreator = window.URL || window.webkitURL;
                        var objectUrl = urlCreator.createObjectURL(blob);
                        a.href = objectUrl;
                        a.download = scope.downloadFileName;
                        a.click();
                        //URL.revokeObjectURL(objectUrl);
                    }).catch(function (error) { $log.error(error); });
                });
            }
        };
    }).directive('staticInclude', function ($http, $templateCache, $compile) { return function (scope, element, attrs) {
        var templatePath = attrs.staticInclude;
        $http.get(templatePath, { cache: $templateCache }).success(function (response) {
            var contents = element.html(response).contents();
            $compile(contents)(scope);
        });
    }; })
        .directive('showonhoverparent', function () {
        return {
            link: function (scope, element, attrs) {
                element.parent().bind('mouseenter', function () {
                    element.show();
                });
                element.parent().bind('mouseleave', function () {
                    element.hide();
                });
            }
        };
    });
    ;
    function generateUuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    ;
})(Directives || (Directives = {}));
//# sourceMappingURL=directives.js.map