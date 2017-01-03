module Directives {

    declare var Hammer: any;

    interface IFormGroupArguments extends angular.IScope {
        forLabel: string;
        isInvalid: boolean;
        isRequired: boolean;
        errorMessage: string;
        label: string;
        getError: () => any;
        isDirty: boolean;
        currentValue: any
    }

    interface IPaginatorScope extends angular.IScope {
        items: any[]
        currentPage: number
        getPageClass: (page: number) => string
        pageSize: number
        totalItems: number
        pageCount: number
        resourceUrl: string
        sorter: string;
        ascending: boolean;
        selectPage: (page: number) => void;
        filters: {};
        cachekey: string
    }

    interface ICountrySelectorScope extends angular.IScope {
        getProvinces: () => void
        provinces: any[]
        provinceId: number;
        provinceName: string;

        getCountries: () => void
        countries: any[]
        countryId: number;
        countryName: string;

        getMunicipalities: () => void
        municipalities: any[]
        municipalityId: number;
        municipalityName: string;

        postalcode: string
        disabled: boolean;
        showpostalcode: string;
        changeMunicipality: (municipalityId: number) => void;
        changeProvince: () => void
        changeCountry: () => void
    }

    interface IPaginatorFilter {
        name: string
        value: any
    }

    declare var moment: any;

    angular.module("directives", ['caching', 'highcharts-ng'])
        .directive('highchartExt', ($filter: angular.IFilterService) => {
            return {
                template: '<div></div>',
                restrict: 'E',
                scope: {
                    title: '@',
                    data: '=',
                    yAxisTitle: '@'
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: any, ctrl: angular.INgModelController) => {
                    (<any>element).parent().highcharts({
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
                    (<any>element).remove();
                }
            };
        })
        .directive('jqueryDaterangepicker', () => {
            return {
                restrict: 'A',
                scope: {
                    startDate: '=startDate',
                    endDate: '=endDate',
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: any, ctrl: angular.INgModelController) => {

                    (<any>element).daterangepicker({
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
                    },
                        (start: any, end: any) => {
                            scope.$apply(() => {
                                scope.startDate = start._d;
                                scope.endDate = end._d;
                            });
                            //console.log("Callback has been called!");
                            //  element.html(start + ' - ' + end);
                        }
                    );
                }

            }
        })
        .directive('jqueryColorpicker', ($parse: angular.IParseService) => {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any, ctrl: angular.INgModelController) => {
                    var e = element;

                    var id = "color_" + element.attr('name');

                    var data = e.data();
                    var submitBtn = data.inline ? 0 : 1;

                    e.attr("id", id);

                    if (data.addon && e.is("input")) {
                        $('#' + id).next().css("width", e.outerHeight());
                    }

                    (<any>e).colpick({
                        bornIn: "body",
                        flat: data.inline || false,
                        submit: submitBtn,
                        layout: data.layout || 'hex',
                        color: e.val(),
                        colorScheme: data.theme || "gray",
                        onChange: (hsb, hex, rgb) => {
                            $('#' + id).val('#' + hex);
                            if (data.addon) {
                                $('#' + id).css({ 'border-color': '#' + hex });
                                $('#' + id).next().css({ 'background-color': '#' + hex, 'border-color': '#' + hex });
                            }
                            return scope.$apply(() => ctrl.$setViewValue('#' + hex));
                        },
                        onSubmit: (hsb, hex, rgb, el) => {
                            $(el).val('#' + hex);
                            (<any>$(el)).colpickHide();
                            return scope.$apply(() => ctrl.$setViewValue('#' + hex));
                        }
                    });

                    scope.$watch(attrs['ngModel'], (newvalue: string) => {
                        if (angular.isDefined(newvalue) && newvalue.length > 0) {
                            var hex = newvalue.substring(1);
                            $('#' + id).css({ 'border-color': '#' + hex });
                            $('#' + id).next().css({ 'background-color': '#' + hex, 'border-color': '#' + hex });
                        }
                    });


                }
            };
        })

        .directive('jqueryDateinputmask', () => {
            return <angular.IDirective>{
                restrict: 'A',
                require: 'ngModel',
                link: (scope: any, element: any, attrs: angular.IAttributes, ctrl: angular.INgModelController) => {

                    var creditCard = attrs["creditcard"] || "false";

                    var format = creditCard == "true" ? "m/y" : "d/m/y";

                    var placeholder = creditCard == "true" ? "__/____" : "__/__/____";

                    (<any>element).inputmask(format, { "clearIncomplete": true, "placeholder": placeholder });

                    if (ctrl) { // Don't do anything unless we have a model
                        ctrl.$parsers.push(function (value: string) {
                            if (value != null && value != '') {
                                var parts = value.split('/');
                                if (creditCard == "true") {
                                    return new Date(parseInt(parts[1]), parseInt(parts[0]) - 1, 1); // Note: months are 0-based
                                }
                                return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); // Note: months are 0-based
                            }
                            return null;
                        });
                        ctrl.$formatters.push(function (d: Date) {
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
        .directive('jqueryDatetimeinputmask', () => {
            return <angular.IDirective>{
                restrict: 'A',
                require: 'ngModel',
                link: (scope: any, element: any, attrs: angular.IAttributes, ctrl: angular.INgModelController) => {
                    (<any>element).inputmask("datetime", { "clearIncomplete": true, "placeholder": "__/__/____ __:__" });
                    if (ctrl) { // Don't do anything unless we have a model
                        ctrl.$parsers.push((value: string) => {
                            if (value != null && value != '') {
                                var mainparts = value.split(' ');
                                var dateparts = mainparts[0].split('/');
                                var timeparts = mainparts[1].split(':');
                                return new Date(parseInt(dateparts[2]), parseInt(dateparts[1]) - 1, parseInt(dateparts[0]), parseInt(timeparts[0]), parseInt(timeparts[1])); // Note: months are 0-based
                            }
                            return null;
                        });
                        ctrl.$formatters.push((d: Date) => {
                            if (angular.isDefined(d) && d != null) {
                                return ('00' + d.getDate()).slice(-2) + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2);
                            }
                            return "";
                        });
                    }
                }
            };
        })
        .directive('jqueryTimeinputmask', () => {
            return <angular.IDirective>{
                restrict: 'A',
                require: 'ngModel',
                link: (scope: any, element: any, attrs: angular.IAttributes, ctrl: angular.INgModelController) => {

                    (<any>element).inputmask('h:s', { "clearIncomplete": true, "placeholder": "__:__" });

                    if (ctrl) { // Don't do anything unless we have a model
                        ctrl.$parsers.push((value: string) => {
                            if (value != null && value != '') {
                                var parts = value.split(':');
                                var currentDate = new Date();
                                var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), parseInt(parts[0]), parseInt(parts[1]));
                                return date;
                            }
                            return null;
                        });
                        ctrl.$formatters.push((d: Date) => {
                            if (angular.isDefined(d) && d != null) {
                                return ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2);
                            }
                            return "";
                        });
                    }
                }
            };
        })


        .directive('countrySelector', ($http: angular.IHttpService, $log: angular.ILogService, $q: angular.IQService) => {
            return <angular.IDirective>{
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
                link: (scope: ICountrySelectorScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrl: any) => {

                    scope.municipalities = [];
                    scope.provinces = [];
                    scope.countries = [{ key: 'ITALIA', value: 126 }];

                    if (scope.countryId == null) {
                        scope.countryId = scope.countries[0].value;
                    }
                    scope.getCountries = () => {
                        $http.get(Global.Configuration.serviceHost + 'locations/countries', { cache: true }).success((result: any[]) => {
                            scope.countries = result;
                        }).catch((error: any) => { $log.error(error); });
                    }

                    scope.changeCountry = () => {
                        scope.provinces = [];
                        scope.provinceId = null;
                        scope.provinceName = null;
                        scope.municipalities = [];
                        scope.municipalityId = null;
                        scope.municipalityName = null;
                        scope.postalcode = null;
                    }

                    scope.changeProvince = () => {
                        scope.municipalities = [];
                        scope.municipalityId = null;
                        scope.municipalityName = null;
                        scope.postalcode = null;
                    }

                    scope.changeMunicipality = (mId: number) => {
                        scope.postalcode = null;
                        if (mId > 0) {
                            $http.get(Global.Configuration.serviceHost + 'locations/cities/' + mId, { cache: true }).success((result: any) => {
                                scope.postalcode = result.postalCode;
                            }).catch((error: any) => { $log.error(error); });
                        }
                    }

                    scope.getProvinces = () => {
                        //scope.municipalities = [];
                        if (angular.isDefined(scope.countryId) && scope.countryId > 0) {
                            $http.get(Global.Configuration.serviceHost + 'locations/counties/' + scope.countryId, { cache: true }).success((result: any[]) => {
                                scope.provinces = result;
                            }).catch((error: any) => { $log.error(error); });
                        }
                    }

                    scope.getMunicipalities = () => {
                        if (angular.isDefined(scope.provinceId) && scope.provinceId > 0) {
                            $http.get(Global.Configuration.serviceHost + 'locations/citiesforcounty/' + scope.provinceId, { cache: true }).success((result: any[]) => {
                                scope.municipalities = result;
                            }).catch((error: any) => { $log.error(error); });
                        }
                    }

                    scope.$watch('countryId', (newValue: number) => {
                        if (newValue != null && scope.countryName != null && scope.countries.length == 1) {
                            scope.countries.push({ value: newValue, key: scope.countryName });
                        }
                    });

                    scope.$watch('provinceId', (newValue: number) => {
                        if (newValue != null && scope.provinceName != null && scope.provinces.length == 0) {
                            scope.provinces.push({ id: newValue, name: scope.provinceName, region: '' });
                        }
                    });

                    scope.$watch('municipalityId', (newValue: number) => {
                        if (newValue != null && scope.municipalityName != null && scope.municipalities.length == 0) {
                            scope.municipalities.push({ value: newValue, key: scope.municipalityName });
                        }
                    });


                }
            };
        })
        .directive('sorter', () => {
            return <angular.IDirective>{
                restrict: 'A',
                require: '^paginator',
                link: (scope: IPaginatorScope, element: any, attrs: angular.IAttributes, ctrl: any) => {

                    var sortName = attrs['sorter'];



                    if (sortName != '') {
                        element.addClass('sorting');

                        element.on('click', (event: JQueryEventObject) => {

                            var tdIndex: number;

                            element.closest('tr').find('th').each((idx: number, e: any) => {
                                if (!element.is(e)) {
                                    $(e).removeClass('sorting_asc').removeClass('sorting_desc');
                                } else {
                                    tdIndex = idx;
                                }
                            });


                            if (element.hasClass('sorting_asc')) {
                                element.removeClass('sorting_asc').addClass('sorting_desc');
                            } else {
                                element.removeClass('sorting_desc').addClass('sorting_asc');
                            }

                            ctrl.setSorter(sortName);
                        });
                    }
                }
            };
        }).directive('formSubmit', (notification: Notification.INotificationService, $filter: angular.IFilterService) => {
            return {
                restrict: 'A',
                require: '^form',
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, form: angular.IFormController) => {

                    if (attrs["novalidate"] == undefined)
                        attrs.$set('novalidate', 'novalidate');

                    element.bind('submit', e => {
                        e.preventDefault();

                        scope.$apply(() => {
                            scope.submitted = true;
                            scope.$broadcast('submitted');
                        });

                        // Get the form object.
                        if (form.$valid) {
                            // If the form is valid call the method specified
                            scope.$eval(attrs['formSubmit']);
                            return;
                        } else {
                            //var errors = $filter('numberoferrors')(form);
                            notification.showError('Attenzione non è possibile continuare perchè ci sono alcuni errori di validazione.');
                        }


                    });
                }
            };
        }).directive('formErrorsCount', ($log: angular.ILogService, $filter: any, $compile: any) => {
            return {
                restrict: 'A',
                scope: {
                    formErrorsCount: '@'
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                    scope.isDirty = false;

                    scope.$on('submitted', (event, args) => {
                        scope.submitted = true;
                    });

                    scope.$watch('formErrorsCount', (formName: string) => {
                        if (formName) {
                            var targetScope = findScope(formName, scope);
                            if (targetScope) {

                                targetScope.$watch(formName + '.$dirty', (dirty: boolean) => {
                                    scope.dirty = dirty;
                                });

                                targetScope.$watch(formName + '.$invalid', (invalid: boolean) => {
                                    scope.invalid = invalid;
                                });

                                targetScope.$watch(formName + '.$error', (errors: any) => {
                                    scope.errorCount = $filter('numberoferrors')(targetScope[formName]);
                                    //$log.info(form.$name + ' --> ' + scope.errorCount);

                                    if (scope.errorCount > 0) {
                                        element.closest('[data-toggle="tab"]').addClass('tab-error');
                                    } else {
                                        element.closest('[data-toggle="tab"]').removeClass('tab-error');
                                    }
                                }, true);

                                var spanElement = $compile('<span data-ng-show="(dirty || submitted) && invalid" class="badge bg-danger fx-fade-left fx-easing-elastic"><b>{{errorCount}}</b></span>')(scope);
                                element.append(spanElement);
                            }
                        }
                    });

                    function findScope(formName: string, targetScope: any) {
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
        .directive('paginator', ($resource: angular.resource.IResourceService, dateFilter: any, $interval: angular.IIntervalService, caching: Caching.ICachingService) => {
            return <angular.IDirective>{
                templateUrl: (element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
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
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrl: any) => {

                    var resource = $resource<any>(scope.resourceUrl + ':pageIndex/:pageSize/:sortBy/:ascending', { pageIndex: '@pageIndex', pageSize: '@pageSize', ascending: '@ascending', sortBy: '@sortBy' });

                    scope.currentPage = 1;

                    if (angular.isUndefined(scope.pageSize)) {
                        scope.pageSize = "10";
                    }

                    var stop;
                    var requestParamsFromCache = null;

                    if (angular.isDefined(scope.cachekey)) {

                        var filtersFromCache = caching.get(scope.cachekey + '_filters');
                        if (angular.isDefined(filtersFromCache)) scope.filters = filtersFromCache;

                        requestParamsFromCache = caching.get(scope.cachekey + '_requestparams');
                    }

                    scope.$watch('filters', (newValue: {}) => {
                        if (angular.isDefined(stop)) {
                            $interval.cancel(stop);
                        }
                        stop = $interval(function () { scope.selectPage(1); $interval.cancel(stop); }, 500);
                    }, true);

                    scope.changePageSize = (pageSize) => {
                        scope.pageSize = pageSize;
                        scope.selectPage(1);
                    }

                    scope.selectPage = (page: number) => {
                        scope.currentPage = page;

                        var requestParams = {};
                        if (requestParamsFromCache != null) {
                            angular.copy(requestParamsFromCache, requestParams);
                            scope.pageSize = requestParams['pageSize'];
                            scope.currentPage = requestParams['pageIndex'];
                            scope.sorter = requestParams['sortBy'];
                            requestParamsFromCache = null;
                        } else {
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
                            angular.forEach(scope.filters, (value, key) => {
                                var requestValue = value;
    
                                if (angular.isDate(requestValue)) {
                                    requestValue = value;
                                }
                                else if (requestValue && value && typeof (value) === 'object')
                                    requestValue = value.value;

                               
                                requestParams[key] = requestValue;
                            });
                        }

                        resource.get(requestParams,
                            (result: any) => {
                                scope.items = result.data;
                                scope.totalItems = result.total;
                                scope.pageCount = (angular.isDefined(scope.totalItems)) ? Math.ceil(scope.totalItems / parseInt(scope.pageSize)) : 0;
                            });
                    }

                },
                controller: function ($scope: IPaginatorScope) {

                    this.setSorter = (sorter: string) => {
                        if (sorter != '') {
                            if (angular.isUndefined($scope.sorter) || sorter != $scope.sorter) {
                                $scope.ascending = true;
                            } else {
                                $scope.ascending = !$scope.ascending;
                            }

                            $scope.sorter = sorter;
                            $scope.selectPage(1);
                        }
                    }

                    this.setFilters = (filters: IPaginatorFilter[]) => {
                        if (angular.isArray(filters)) {
                            angular.copy(filters, $scope.filters);
                            $scope.selectPage(1);
                        }
                    }

                }
            };
        })
        .directive('checkboxList', () => {
            return <angular.IDirective>{
                templateUrl: '/common/directives/templates/checkboxList.html',
                restrict: 'AE',
                scope: {
                    sourceItems: '=sourceItems',
                    destinationItems: '=destinationItems',
                    itemPropertyname: '@itemPropertyname',
                    itemPropertyvalue: '@itemPropertyvalue',
                    itemPropertyselected: '@itemPropertyselected'
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                    scope.$watch('sourceItems', () => { performanceSelected(); });
                    scope.$watch('destinationItems', () => { performanceSelected(); });

                    scope.selectedChanged = (item: any) => {
                        scope.destinationItems = [];
                        scope.sourceItems
                            .filter((itemSource: any) => { return itemSource[scope.itemPropertyselected] == true; })
                            .forEach((r: any) => { scope.destinationItems.push(r[scope.itemPropertyvalue]); });
                    }

                    function performanceSelected() {
                        if (angular.isDefined(scope.destinationItems) && angular.isDefined(scope.sourceItems)) {
                            scope.destinationItems.forEach((itemDestination: any) => {
                                scope.sourceItems
                                    .filter((itemSource: any) => { return itemSource[scope.itemPropertyvalue] == itemDestination; })
                                    .forEach((item: any) => { item[scope.itemPropertyselected] = true; });;
                            });
                        }
                    }
                }
            };
        })
        .directive('jqueryDatepicker', (dateFilter: any) => {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any, ctrl: any) => {
                    (<any>element).datetimepicker({
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

                    scope.$watch(attrs['ngModel'], (newValue: Date) => {

                        if (angular.isDefined(newValue)) {
                            var requestValue = dateFilter(newValue, 'dd/MM/yyyy');
                            element.val(requestValue);
                            (<any>element).datetimepicker('update');
                        }
                    });

                    if (ctrl) { // Don't do anything unless we have a model
                        ctrl.$parsers.push((value: string) => {
                            if (value != null && value != '') {
                                var parts = value.split('/');
                                return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])); // Note: months are 0-based
                            }
                            return null;
                        });
                        ctrl.$formatters.push((d: Date) => {
                            if (angular.isDefined(d) && d != null) {
                                return ('00' + d.getDate()).slice(-2) + '/' + ('00' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
                            }
                            return "";
                        });
                    }
                }
            };
        })
        .directive('jqueryPopover', (dateFilter: any) => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
                    (<any>element).popover({ html: true, animation: true });

                    attrs.$observe('content', (content: string) => {
                        if (content != null && content != "") {
                            (<any>element).popover('destroy').popover({ html: true, animation: true }).focus();
                        }
                    });
                }
            };
        })
        .directive('jqueryTooltip', (dateFilter: any) => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    attrs.$observe('title', (content: string) => {
                        if (content != null && content != "") {
                            (<any>element).tooltip();
                        }
                    });
                }
            };
        })
        .directive('jqueryPopup', (dateFilter: any, notification: Notification.INotificationService, $compile: any) => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    element.on('click', function () {
                        var title = attrs.title ? attrs.title : attrs.originalTitle;
                        notification.showInformation(title);
                    });
                }
            };
        })
        .directive('jqueryProgressbar', () => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    (<any>element).progressbar();

                    attrs.$observe('ariaValuetransitiongoal', (content: string) => { check(content); });
                    attrs.$observe('ariaValuemax', (content: string) => { check(content); });

                    function check(content: string) {
                        if (content != null && content != "") {
                            (<any>element).progressbar("destroy").progressbar();
                        }
                    }
                }
            };
        })
        .directive('jqueryDatetimepicker', (dateFilter: any) => {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    (<any>element).datetimepicker({
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

                    scope.$watch(attrs['ngModel'], (newValue: Date) => {

                        if (angular.isDefined(newValue)) {
                            var requestValue = dateFilter(newValue, 'dd/MM/yyyy HH:mm');
                            element.val(requestValue);
                            (<any>element).datetimepicker('update');
                        }
                    });
                }
            };
        })
        .directive('jquerySelectpicker', ($parse: angular.IParseService) => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    var e = element;

                    if (angular.isDefined(attrs['ngOptions'])) {

                        var ngOptionsPart = attrs['ngOptions'].split(/[|]+/).filter((item) => {
                            return item.indexOf(' in ') > 0;
                        }).pop();

                        var scopeCollection = ngOptionsPart.split(/[ ]+/).filter((item) => {
                            return item != '';
                        }).pop();

                        scope.$watch(scopeCollection, () => {
                            refresh(e);
                        }, true);
                    }

                    scope.$watch(attrs['ngModel'], () => {
                        refresh(e);
                    });

                    if (attrs['ngDisabled'] != null) {
                        scope.$watch(attrs['ngDisabled'], (newValue: boolean) => {
                            $(e).prop('disabled', newValue);
                            refresh(e);
                        });
                    }

                    function refresh(e: any) {
                        (<any>$(e)).selectpicker('refresh');
                    }
                }
            };
        })
        .directive('jquerySelectpickerLive', () => {
            return {
                restrict: 'A',
                scope: { jquerySelectpickerLive: '&' },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: any) => {

                    (<any>$(element)).selectpicker('refresh');
                    element.parent().find('button').on('click', () => { scope.jquerySelectpickerLive(); });

                    if (angular.isDefined(attrs['ngOptions'])) {
                        var ngOptionsPart = attrs['ngOptions'].split(/[|]+/).filter((item) => { return item.indexOf(' in ') > 0; }).pop();
                        var scopeCollection = ngOptionsPart.split(/[ ]+/).filter((item) => { return item != ''; }).pop();
                        scope.$parent.$watch(scopeCollection, () => { (<any>$(element)).selectpicker('refresh'); });
                    }

                    scope.$parent.$watch(attrs['ngModel'], (newValue) => {
                        (<any>$(element)).selectpicker('refresh');
                    });


                    if (attrs['ngDisabled'] != null) {
                        scope.$parent.$watch(attrs['ngDisabled'], (newValue: boolean) => {
                            $(element).prop('disabled', newValue);
                            (<any>$(element)).selectpicker('refresh');
                        });
                    }
                }
            };
        })
        .directive('kvpSelect', () => {
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
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: any) => {

                    scope.$watch('current', (item: any) => {
                        if (item) {
                            //Commentato per evitare ordinamento mesi in ordine alfabetico - DA VERIFICARE
                            scope.items = Global.mergeKeyValuePair(scope.items, [item]);
                        }
                    });


                    scope.getItems = () => {
                        if (scope.action) {
                            scope.action(scope.item).success((result: any[]) => {
                                var itemsToMerge = [];
                                angular.copy(result, itemsToMerge);
                                if (result && result.length > 0) {
                                    if (result[0].id) {
                                        itemsToMerge = [];
                                        angular.forEach(result, (item) => {
                                            itemsToMerge.push({ key: item.name, value: item.id });
                                        });
                                    }
                                }
                                scope.items = Global.mergeKeyValuePair(scope.items, itemsToMerge);
                            });
                        }
                    }
                }
            };
        }).directive('ignoreDirty', [() => {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: (scope, elm, attrs, ctrl) => {
                    ctrl.$pristine = false;
                }
            }
        }])
        .directive('jqueryIcheck', ($timeout: angular.ITimeoutService) => {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any, ngModel: angular.INgModelController) => {
                    var data = element.data();

                    return $timeout(() => {
                        var value;
                        value = attrs['value'];

                        scope.$watch(attrs['ngModel'], newValue => {
                            (<any>$(element)).iCheck('update');
                        });

                        if (angular.isDefined(attrs['ngDisabled'])) {
                            scope.$watch(attrs['ngDisabled'], newValue => {
                                (<any>$(element)).iCheck('update');
                            });
                        }

                        if (angular.isDefined(attrs['ngChecked'])) {
                            scope.$watch(attrs['ngChecked'], newValue => {
                                (<any>$(element)).iCheck('update');
                            });
                        }

                        return (<any>$(element)).iCheck({
                            checkboxClass: data.checkboxclass || 'icheckbox_flat-green',
                            radioClass: 'iradio_flat-green'
                        }).on('ifChanged', event => {
                            if ($(element).attr('type') === 'checkbox' && attrs['ngModel']) {
                                scope.$apply(() => ngModel.$setViewValue(event.target.checked));
                            }
                            if ($(element).attr('type') === 'radio' && attrs['ngModel']) {
                                return scope.$apply(() => ngModel.$setViewValue(value));
                            }
                            //return scope.$apply(() => ngModel.$setViewValue(value));
                        });
                    });
                }
            };
        })
        .directive('tabbablesections', ($http: angular.IHttpService, $log: any, $window: any, $interval: angular.IIntervalService) => {
            return <angular.IDirective>{
                restrict: 'A',
                scope:
                {
                    tabbablesections: '='
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                    var uuid = generateUuid();
                    scope.tabbablesections =
                        {
                            tabs: [],
                            currentTab: 0
                        };

                    $(element).find('.tab-pane').each((index, ele) => {
                        $(ele).attr('id', 'tab' + uuid + index);
                        if (scope.tabbablesections.currentTab === index)
                            $(ele).addClass('in active');
                    });


                    $(element).find('ul > li > a').each((index, e) => {

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
                        $(e).addClass('uppercase').attr('data-target', '#tab' + uuid + index).attr('data-toggle', 'tab').attr('href', 'javascript:void(0)').on('click', (ele) => {
                            scope.$apply(() => {
                                scope.tabbablesections.tabs[index].loaded = true;
                                scope.tabbablesections.currentTab = index;
                            });
                        });
                    });
                }
            }
        })
        .directive('jqueryChart', () => {
            return {
                restrict: 'A',
                scope: {
                    data: '=data',
                    options: '=options'
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: any) => {
                    scope.$parent.$watch(attrs['data'], (newValue: any) => {
                        (<any>$).plot(element, newValue, scope.options);
                    });
                }
            };
        })
        .directive('entityInformation', ($http: angular.IHttpService) => {
            return <angular.IDirective>{
                restrict: 'E',
                templateUrl: '/common/directives/templates/_entityInformation.html',
                scope: {
                    entity: '='
                },
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                }
            };
        })
        .directive('jqueryEasychart', () => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    var thisEasy = element;
                    var $data = element.data();

                    $data.barColor = (<any>$).fillColor(thisEasy) || "#6CC3A0";
                    $data.size = $data.size || 119;
                    $data.trackColor = $data.trackColor || "#EEE";
                    $data.lineCap = $data.lineCap || "butt";
                    $data.lineWidth = $data.lineWidth || 20;
                    $data.scaleColor = $data.scaleColor || false,
                        $data.onStep = function (from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    thisEasy.find('.percent').css({ "line-height": $data.size + "px" });
                    (<any>thisEasy).easyPieChart($data);

                }
            };
        })
        .directive('jqueryMmenu', () => {
            return {
                restrict: 'A',
                link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
                    var data = element.data();

                    (<any>element).mmenu({
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

                    element.find('a[href^="/"]').each((index: number, e: Element) => {
                        $(e).click(() => {
                            (<any>element).trigger('close.mm');
                        });
                    });

                    var elementId = element.attr('id');

                    if (elementId != '') {
                        var wrapper = Hammer(document.getElementById(elementId));
                        wrapper.on("dragright", event => {
                            if ((event.gesture.deltaY <= 7 && event.gesture.deltaY >= -7) && event.gesture.deltaX > 100) {
                                $('nav#menu').trigger('open.mm');
                            }
                        });
                        wrapper.on("dragleft", event => {
                            if ((event.gesture.deltaY <= 5 && event.gesture.deltaY >= -5) && event.gesture.deltaX < -100) {
                                $('nav#contact-right').trigger('open.mm');
                            }
                        });
                    }
                }
            };
        })
        .directive('ngForm', () => {
            return {
                restrict: 'EA',
                require: 'form',
                link: (scope, elem, attrs, formCtrl: any) => {

                    scope.$on('submitted', () => {
                        formCtrl.$setSubmitted();
                    });

                }
            };
        })
        .directive('formGroup', ($compile: angular.ICompileService, $timeout: any) => {
            return {
                restrict: 'A',
                require: "^form",
                templateUrl: (element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
                    return element.is('td') ? '/common/directives/templates/formTableField.html' :
                        '/common/directives/templates/formGroup.html';
                },
                replace: true,
                transclude: true,
                scope: true,
                link: (scope: any, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, formController: any, transclude: angular.ITranscludeFunction) => {

                    var currentScope = scope;

                    transclude(scope.$parent, content => {
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


                    scope.getRightClass = () => {
                        //col-md-{{right}} label != null ? '': 'col-md-offset-{{left}}'
                        var _class = 'col-md-' + scope.right;

                        if (scope.label == null && scope.left != null)
                            _class += 'col-md-offset-' + scope.left;

                        var hForm = $(element).closest('form.form-horizontal');
                        if (hForm.length == 0) _class = null;

                        return _class;

                    }

                    scope.getLeftClass = () => {
                        //class="control-label {{labelClass}} col-md-{{left}}" 

                        var _class = 'control-label ' + scope.labelClass + ' col-md-' + scope.left;
                        var hForm = $(element).closest('form.form-horizontal');
                        if (hForm.length == 0) _class = null;

                        return _class;
                    }

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

                            if (angular.isUndefined(input.attr("id"))) { input.attr("id", generateUuid()); }
                            scope.forLabel = input.attr("id");

                            var ele = angular.element('<label class="help-block" data-ng-show="' + invalidExp + ' && (' + dirtyExp + ' || ' + submitExpression + ')"><span for="' + scope.forLabel + '" class="color bg-danger-darken uppercase"> {{getError(' + errorExp + ',"' + scope.label + '")}} </span></label>');
                            element.find('div').first().append(ele);
                            $compile(ele)(scope);

                            scope.isRequired = angular.isDefined(input.attr('required'));
                            var requiredExpression = input.attr('ng-required') || input.data('ng-required');

                            if (angular.isDefined(requiredExpression)) {
                                currentScope.$watch(requiredExpression, (required: boolean) => {
                                    scope.isRequired = required;
                                });
                            }

                            if (invalidExpression != '') invalidExpression += ' || ';
                            invalidExpression += invalidExp;

                            if (dirtyExpression != '') dirtyExpression += ' || ';
                            dirtyExpression += dirtyExp;
                        }
                    }

                    currentScope.$watch(invalidExpression, (newvalue: boolean) => {
                        scope.isInvalid = newvalue;
                    });

                    currentScope.$watch(dirtyExpression, (newvalue: boolean) => {
                        scope.isDirty = newvalue;
                    });


                    currentScope.$watch(submitExpression, (newvalue: boolean) => {
                        scope.isSubmitted = newvalue;
                    });


                    scope.getError = (error, label) => {

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
                        };
                        return errorMessage;
                    };
                }
            };
        })

        .directive('handleClose', () => {
            return {
                scope: {
                    handleClose: '&'
                },
                link: (scope: any, elem, attrs) => {

                    window.onbeforeunload = () => {
                        if (angular.isDefined(scope.handleClose)) {
                            scope.handleClose();
                        }
                        return '';
                    }

                    scope.$on('$locationChangeStart', (event, next, current) => {
                        if (angular.isDefined(scope.handleClose)) {
                            scope.handleClose();
                        }
                        return true;
                    });
                }
            };
        })
        .directive('formAutofillFix', ($timeout: angular.ITimeoutService) => (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: any) => {
            element.prop('method', 'post');
            if (attrs.ngSubmit) {
                $timeout(() => {
                    element
                        .unbind('submit')
                        .bind('submit', (event: BaseJQueryEventObject) => {
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
        }).directive('downloadFile', ($log: angular.ILogService) => {
            return {
                restrict: 'A',
                scope: {
                    downloadFile: '&',
                    downloadFileName: '@downloadFileName',
                    downloadFileType: '@downloadFileType'
                },
                link: (scope, element: angular.IAugmentedJQuery, attrs) => {
                    var a = <any>document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";

                    element.on('click', () => {
                        scope.downloadFile().then((data) => {


                            var blob = new Blob([data], { type: scope.downloadFileType || 'application/octet-stream' });
                            var urlCreator = (<any>window).URL || (<any>window).webkitURL;

                            var objectUrl = urlCreator.createObjectURL(blob);

                            a.href = objectUrl;
                            a.download = scope.downloadFileName;
                            a.click();

                            //URL.revokeObjectURL(objectUrl);
                        }).catch((error: any) => { $log.error(error); });
                    });

                }
            };
        }).directive('staticInclude', ($http, $templateCache, $compile) => (scope, element, attrs) => {
            var templatePath = attrs.staticInclude;
            $http.get(templatePath, { cache: $templateCache }).success(response => {
                var contents = element.html(response).contents();
                $compile(contents)(scope);
            });
        })
        .directive('showonhoverparent', () => {
            return {
                link: (scope, element, attrs) => {
                    element.parent().bind('mouseenter', () => {
                        element.show();
                    });
                    element.parent().bind('mouseleave', () => {
                        element.hide();
                    });
                }
            };
        });;

    function generateUuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

}