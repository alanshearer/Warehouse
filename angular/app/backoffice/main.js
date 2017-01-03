var BackOfficeApp;
(function (BackOfficeApp) {
    var requests = 0;
    var overlay;
    angular.module('backofficeApp', [
        'backofficeApp.Controllers',
        'backofficeApp.Filters',
        'jmdobry.angular-cache',
        'ui.bootstrap',
        'ngRoute',
        'ngAnimate',
        'ngResource',
        'ng-breadcrumbs',
        'filters',
        'directives',
        'authentication',
        'notification',
        'caching',
        'blueimp.fileupload',
        'ngClipboard',
        'LocalStorageModule',
        'highcharts-ng'
    ])
        .factory('myHttpInterceptor', function ($q, notification) {
        return {
            'request': function (config) {
                if (!overlay) {
                    overlay = $('<div class="load-overlay"><div><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div></div><span data-target="caricamento">Caricamento...</span></div>');
                    $('#content').append(overlay);
                }
                if (config.url.indexOf("/api/") >= 0) {
                    requests++;
                    if (config.headers["No-Loading"] == null || config.headers["No-Loading"] == false) {
                        overlay.css('opacity', 1).fadeIn();
                    }
                }
                return config;
            },
            'responseError': function (response) {
                if (response.config.url.indexOf("/api/") >= 0) {
                    requests--;
                    if (requests <= 0)
                        $('body').find(overlay).fadeOut("", function () { requests = 0; });
                }
                notification.handleException(response.data);
                return $q.reject(response);
            },
            'response': function (response) {
                if (response.config.url.indexOf("/api/") >= 0) {
                    requests--;
                    if (requests <= 0)
                        $('body').find(overlay).fadeOut("", function () { requests = 0; });
                }
                return response || $q.when(response);
            },
        };
    })
        .config(function ($routeProvider, ngClipProvider, $locationProvider, $httpProvider, authenticationProvider, fileUploadProvider) {
        if (window.history && history.pushState) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }
        var defaultPath = getParameterByName('path');
        if (defaultPath == null || defaultPath.toLocaleLowerCase().indexOf('.html') >= 0)
            defaultPath = "/login";
        ngClipProvider.setPath("/src/content/plugins/zeroclipboard-2.1.6/dist/ZeroClipboard.swf");
        //fileUploadProvider.defaults.redirect = window.location.href.replace(/\/[^\/]*$/,'/cors/result.html?%s');
        // Demo settings:
        angular.extend(fileUploadProvider.defaults, {
            // send Blob objects via XHR requests:
            maxFileSize: 5242880,
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(pdf|xps)$/i
        });
        $routeProvider
            .when('/login', {
            templateUrl: "/app/backoffice/views/login/_login.html",
            label: 'Accesso'
        })
            .when('/dashboard', {
            templateUrl: "/app/backoffice/views/_dashboard.html",
            roles: "'SysAdmin' || 'Supervisor' || 'Management' || 'Backoffice' || 'DataEntry' || 'HrSpecialist' || 'HrManager' || 'FloorManager'",
            label: 'Dashboard'
        })
            .when('/users', {
            templateUrl: "/app/backoffice/views/users/_list.html",
            roles: "'SysAdmin' || 'Supervisor'",
            label: 'Gestione utenti'
        }).when('/users/edit/:id', {
            templateUrl: "/app/backoffice/views/users/_edit.html",
            roles: "'SysAdmin' || 'Supervisor'",
            label: 'Modifica utente'
        }).when('/users/create', {
            templateUrl: "/app/backoffice/views/users/_edit.html",
            roles: "'SysAdmin' || 'Supervisor'",
            label: 'Nuovo utente'
        }).when('/profile', {
            templateUrl: "/app/backoffice/views/_profile.html",
            roles: "'SysAdmin' || 'Supervisor' || 'Management' || 'Backoffice'",
            label: 'Profilo utente'
        }).when('/companies', {
            templateUrl: "/app/backoffice/views/companies/_list.html",
            roles: "'Supervisor'",
            label: 'Gestione aziende'
        }).when('/companies/edit/:id', {
            templateUrl: "/app/backoffice/views/companies/_edit.html",
            roles: "'Supervisor'",
            label: 'Modifica azienda'
        }).when('/companies/create', {
            templateUrl: "/app/backoffice/views/companies/_edit.html",
            roles: "'Supervisor'",
            label: 'Nuova azienda'
        }).when('/campaigns', {
            templateUrl: "/app/backoffice/views/campaigns/_list.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Campagne'
        }).when('/campaigns/edit/:id', {
            templateUrl: "/app/backoffice/views/campaigns/_edit.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Modifica campagna'
        }).when('/campaigns/create', {
            templateUrl: "/app/backoffice/views/campaigns/_edit.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Nuova'
        }).when('/admin/tables', {
            templateUrl: "/app/backoffice/views/admin/tables/_list.html",
            roles: "'SysAdmin'",
            label: 'Gestione tabelle'
        }).when('/admin/configuration', {
            templateUrl: "/app/backoffice/views/admin/configuration/_configuration.html",
            roles: "'SysAdmin'",
            label: 'Configurazione di sistema'
        }).when('/changelog', {
            templateUrl: "/app/backoffice/views/_changeLog.html",
            label: 'Riepilogo aggiornamenti'
        }).when('/employees', {
            templateUrl: "/app/backoffice/views/employees/_list.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Dipendenti'
        }).when('/employees/edit/:employeeId', {
            templateUrl: "/app/backoffice/views/employees/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Modifica dipendente'
        }).when('/employees/edit/:employeeId/contracts/edit/:id', {
            templateUrl: "/app/backoffice/views/contracts/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Modifica contratto'
        }).when('/employees/edit/:employeeId/contracts/create', {
            templateUrl: "/app/backoffice/views/contracts/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Nuovo contratto'
        }).when('/employees/edit/:employeeId/positions/edit/:id', {
            templateUrl: "/app/backoffice/views/employees/tabs/collocazione/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Modifica collocazione'
        }).when('/employees/edit/:employeeId/positions/create', {
            templateUrl: "/app/backoffice/views/employees/tabs/collocazione/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Nuova collocazione'
        }).when('/employees/create', {
            templateUrl: "/app/backoffice/views/employees/_edit.html",
            roles: "'SysAdmin' || 'HrSpecialist' || 'HrManager'",
            label: 'Nuovo'
        })
            .when('/contracts', {
            templateUrl: "/app/backoffice/views/contracts/_list.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Gestione contratti'
        }).when('/contracts/edit/:id', {
            templateUrl: "/app/backoffice/views/contracts/_edit.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Modifica contratto'
        }).when('/contracts/create', {
            templateUrl: "/app/backoffice/views/contracts/_edit.html",
            roles: "'SysAdmin' || 'HrManager'",
            label: 'Nuovo contratto'
        })
            .when('/registrations', {
            templateUrl: "/app/backoffice/views/presences/_edit.html",
            roles: "'Backoffice' || 'SysAdmin' || 'DataEntry' || 'HrManager'",
            label: 'Registrazioni'
        })
            .when('/report', {
            templateUrl: "/app/backoffice/views/reports/_reports.html",
            roles: "'SysAdmin' || 'Supervisor' || 'Backoffice' || 'DataEntry' || 'HrManager' || 'FloorManager'",
            label: 'Report'
        })
            .otherwise({
            redirectTo: defaultPath
        });
        authenticationProvider.configuration.validateServiceUrl = Global.Configuration.serviceHost + 'users/validate';
        authenticationProvider.configuration.resetPasswordServiceUrl = Global.Configuration.serviceHost + 'users/resetpassword';
        $httpProvider.interceptors.push('myHttpInterceptor');
        $httpProvider.defaults.transformResponse.push(function (responseData) {
            convertDateStringsToDates(responseData);
            return responseData;
        });
        $httpProvider.defaults.transformRequest.push(function (requestData) {
            convertDatesToDateStrings(requestData);
            return requestData;
        });
    }).run(function ($rootScope, authentication, $location, $filter, $templateCache) {
        authentication.fillAuthData();
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            if (!angular.isUndefined(current.roles) && current.roles && !$filter('hasRole')(current.roles)) {
                $location.path('login');
            }
        });
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (typeof (current) !== 'undefined') {
                $templateCache.remove(current.templateUrl);
            }
        });
    });
    var regexIso8601 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
    function convertDateStringsToDates(input) {
        // Ignore things that aren't objects.
        if (typeof input !== "object")
            return input;
        for (var key in input) {
            if (!input.hasOwnProperty(key))
                continue;
            var value = input[key];
            var match;
            // Check for string properties which look like dates.
            if (typeof value === "string" && (match = value.match(regexIso8601))) {
                input[key] = dateObject(match[0]);
            }
            else if (typeof value === "object") {
                convertDateStringsToDates(value);
            }
        }
        return input;
    }
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function convertDatesToDateStrings(input) {
        //if (input) {
        //    input = JSON.parse(input);
        //    // Ignore things that aren't objects.
        //    if (typeof input !== "object") return input;
        //    for (var key in input) {
        //        if (!input.hasOwnProperty(key)) continue;
        //        var value = input[key];
        //        var match;
        //        // Check for string properties which look like dates.
        //        if (typeof value === "string") {
        //            //input[key] = dateObject(match[0]);
        //        } else if (typeof value === "object") {
        //            convertDatesToDateStrings(value);
        //        }
        //    }
        //    return input;
        //}
    }
    function dateObject(s) {
        s = s.split(/\D/);
        return new Date(+s[0], --s[1], +s[2], +s[3], +s[4], +s[5], 0);
    }
})(BackOfficeApp || (BackOfficeApp = {}));
//# sourceMappingURL=main.js.map