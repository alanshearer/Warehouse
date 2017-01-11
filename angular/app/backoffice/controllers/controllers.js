var u = Authentication;
var n = Notification;
var BackOfficeApp;
(function (BackOfficeApp) {
    var Controllers;
    (function (Controllers) {
        var LoginViews;
        (function (LoginViews) {
            LoginViews[LoginViews["Signin"] = 0] = "Signin";
            LoginViews[LoginViews["ResetPassword"] = 1] = "ResetPassword";
            LoginViews[LoginViews["ChangePassword"] = 2] = "ChangePassword";
        })(LoginViews || (LoginViews = {}));
        angular.module("backofficeApp.Controllers", ["authentication", "notification", "ngResource", "filters", "ui.bootstrap"])
            .constant('usersUrl', Global.Configuration.serviceHost + 'users/')
            .constant('companiesUrl', Global.Configuration.serviceHost + 'companies/')
            .constant('registrationsUrl', Global.Configuration.serviceHost + 'registrations/')
            .constant('campaignsUrl', Global.Configuration.serviceHost + 'campaigns/')
            .constant('dashboardUrl', Global.Configuration.serviceHost + 'dashboard/')
            .constant('employeesUrl', Global.Configuration.serviceHost + 'employees/')
            .constant('contractsUrl', Global.Configuration.serviceHost + 'contracts/')
            .constant('catalogsUrl', Global.Configuration.serviceHost + 'catalogs/')
            .constant('configurationsUrl', Global.Configuration.serviceHost + 'configurations/')
            .constant('reportsUrl', Global.Configuration.serviceHost + 'reports/')
            .constant("listActiveClass", "btn-primary")
            .constant("listPageSize", 10)
            .controller('mainCtrl', function ($scope, $rootScope, $filter, $location, $route, notification, authentication, caching, breadcrumbs, $http, usersUrl) {
            $scope.breadcrumbs = breadcrumbs;
            $scope.isAuthenticated = authentication.isAuthenticated;
            $scope.currentUser = authentication.identity;
            $scope.changeCompany = function (company) {
                $http.post(usersUrl + 'changecompany', { companyId: company.companyId })
                    .success(function (result) {
                    authentication.renewalToken(result);
                    caching.clearAll();
                    $location.url('/dashboard');
                    $route.reload();
                });
            };
            $http.get('/content/changelog.json').success(function (result) {
                if (result != null) {
                    $scope.application = {
                        version: result[0].version,
                        date: result[0].date
                    };
                }
            });
            $scope.getBodyClass = function () {
                return $scope.isAuthenticated ? "leftMenu nav-collapse in" : "full-lg";
            };
            $scope.$watch(function () { return authentication.isAuthenticated; }, function (isAuthenticated) {
                $scope.isAuthenticated = isAuthenticated;
            });
            $scope.refreshPage = function () {
                $route.reload();
            };
            $scope.logout = function () {
                authentication.logout();
                $location.url('/login');
            };
        }).config(function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }).controller('loginCtrl', function ($scope, $location, authentication) {
            if (authentication.isAuthenticated == true) {
                $location.url('/dashboard');
                return;
            }
            $scope.credential = { username: '', password: '' };
            $scope.changeView = function (view) {
                if (angular.isString(view)) {
                    view = LoginViews[view.toString()];
                }
                switch (view) {
                    case LoginViews.ResetPassword:
                        $scope.currentView = '/app/backoffice/views/login/views/_resetPassword.html';
                        break;
                    case LoginViews.ChangePassword:
                        $scope.currentView = '/app/backoffice/views/login/views/_changePassword.html';
                        break;
                    default:
                        $scope.currentView = '/app/backoffice/views/login/views/_signIn.html';
                        break;
                }
            };
            $scope.changeView(LoginViews.Signin);
        })
            .controller("signinCtrl", function ($scope, $location, authentication) {
            $scope.signin = function () {
                authentication.login($scope.credential.username, $scope.credential.password)
                    .then(function () {
                    $location.url('/dashboard');
                }).catch(function (error) {
                    if (error.statusCode == System.Net.HttpStatusCode.BadRequest) {
                        if (error.badRequestType == dto.ValidationExceptionCode.PasswordExpired) {
                            $scope.changeView(LoginViews.ChangePassword);
                            return;
                        }
                    }
                });
            };
        })
            .controller('forgotPasswordCtrl', function ($scope, $location, notification, authentication) {
            $scope.resetPassword = function (eMail) {
                authentication.resetPassword($scope.credential.username, eMail)
                    .then(function () {
                    notification.showSuccess('Reimpostazione password eseguita correttamente. E\' stata inviata un e-mail all\'indirizzo ' + eMail);
                    $scope.changeView(LoginViews.Signin);
                });
            };
        })
            .controller('changePasswordCtrl', function ($scope, $http, notification, usersUrl) {
            $scope.changePassword = function (newpassword) {
                $http.post(usersUrl + 'changepassword/', {
                    userName: $scope.credential.username,
                    oldPassword: $scope.credential.password,
                    newPassword: newpassword
                }).then(function () {
                    notification.showSuccess('Cambio password eseguito correttamente. Per proseguire è necessario accedere con la nuova password.');
                    $scope.credential.password = '';
                    $scope.changeView(LoginViews.Signin);
                });
            };
        })
            .controller('usersCtrl', function ($scope, usersUrl, $http, listPageSize, $q) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = usersUrl;
            $scope.filters = {};
            $scope.downloadXls = function () {
                var deffered = $q.defer();
                $http.get(usersUrl + 'xls', { params: $scope.filters }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
        })
            .controller('companiesCtrl', function ($scope, $http, $q, companiesUrl, listPageSize) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = companiesUrl;
            $scope.filters = { isEnabled: true };
            $scope.downloadXls = function () {
                var deffered = $q.defer();
                $http.get(companiesUrl + 'xls', { params: $scope.filters }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
        })
            .controller('campaignsCtrl', function ($scope, $http, $q, campaignsUrl, listPageSize) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = campaignsUrl;
            $scope.filters = {};
            $scope.downloadXls = function () {
                var deffered = $q.defer();
                $http.get(campaignsUrl + 'xls', { params: $scope.filters }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
        }).controller('employeeCampaignsCtrl', function ($scope, $http, companiesUrl, catalogsUrl, employeesUrl, campaignsUrl, notification) {
        }).controller('employeesCtrl', function ($scope, $http, $q, employeesUrl, listPageSize, companiesUrl, campaignsUrl) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = employeesUrl;
            $scope.filters = {};
            $scope.getPersonsInCharge = function () { return $http.get(employeesUrl + 'personsincharge', { headers: { 'No-Loading': true } }); };
            $scope.getDepartments = function () { return $http.get(companiesUrl + 'departments', { headers: { 'No-Loading': true } }); };
            $scope.getWorkPlaces = function () { return $http.get(companiesUrl + 'workplaces', { headers: { 'No-Loading': true } }); };
            $scope.getCampaigns = function () { return $http.get(campaignsUrl + 'summary', { headers: { 'No-Loading': true } }); };
            $scope.downloadXls = function () {
                var deffered = $q.defer();
                $http.get(employeesUrl + 'xls', { params: $scope.filters }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
        }).controller('contractsCtrl', function ($scope, $resource, $http, $q, listPageSize, notification, contractsUrl) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = contractsUrl;
            $scope.filters = {};
            $scope.downloadXls = function () {
                var deffered = $q.defer();
                $http.get(contractsUrl + 'xls', { params: $scope.filters }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
        }).controller('userCtrl', function ($scope, $http, $location, $log, $resource, $routeParams, authentication, usersUrl, notification) {
            $scope.isProfile = $location.path().indexOf('/profile') >= 0;
            var userId = $scope.isProfile ? authentication.identity.id : $routeParams['id'];
            var user = $resource(usersUrl + ':id', { id: !angular.isUndefined(userId) ? userId : '@data.id' }, { save: { method: userId != null ? "PUT" : "POST" } });
            $scope.companies = [];
            $scope.campaigns = [];
            $scope.data = {};
            if (!angular.isUndefined(userId)) {
                user.get(function (result) {
                    $scope.data = result;
                    if (result.companiesRights != null) {
                        angular.forEach(result.companiesRights, function (item) {
                            $scope.companies = Global.mergeKeyValuePair($scope.companies, [{ key: item.companyName, value: item.companyId }]);
                        });
                    }
                    if (result.campaignsRights != null) {
                        angular.forEach(result.campaignsRights, function (item) {
                            $scope.campaigns = Global.mergeKeyValuePair($scope.campaigns, [{ key: item.campaignName, value: item.campaignId }]);
                        });
                    }
                    $scope.getEntitiesForRoleType();
                }, function (error) { notification.handleException(error.data); });
            }
            else {
                $scope.data = new user();
            }
            $scope.getNextChangePasswordDate = function () {
                var nextChangePasswordDate = null;
                if (angular.isDefined($scope.data.lastChangePasswordDate) && $scope.data.lastChangePasswordDate != null && $scope.data.passwordDay > 0) {
                    nextChangePasswordDate = new Date($scope.data.lastChangePasswordDate.getTime());
                    var dayToAdd = 0;
                    if (angular.isDefined($scope.data.passwordDay)) {
                        dayToAdd = $scope.data.passwordDay;
                    }
                    nextChangePasswordDate.setDate(nextChangePasswordDate.getDate() + dayToAdd);
                }
                return nextChangePasswordDate;
            };
            $http.get(usersUrl + 'roles').success(function (result) {
                //$scope.roles = result;
            });
            $scope.removeCompany = function (item) {
                if (angular.isDefined(item)) {
                    var index = $scope.data.companiesRights.indexOf(item);
                    $scope.data.companiesRights.splice(index, 1);
                }
            };
            $scope.removeCampaign = function (item) {
                if (angular.isDefined(item)) {
                    var index = $scope.data.campaignsRights.indexOf(item);
                    $scope.data.campaignsRights.splice(index, 1);
                }
            };
            $scope.addCompany = function () {
                if (angular.isUndefined($scope.data.companiesRights) || $scope.data.companiesRights == null) {
                    $scope.data.companiesRights = [];
                }
                $scope.data.companiesRights.push({
                    companyId: null,
                    companyName: null
                });
            };
            $scope.addCampaign = function () {
                if (angular.isUndefined($scope.data.campaignsRights) || $scope.data.campaignsRights == null) {
                    $scope.data.campaignsRights = [];
                }
                $scope.data.campaignsRights.push({
                    campaignId: null,
                    campaignName: null
                });
            };
            $scope.getEntitiesForRoleType = function () {
            };
            $scope.getCompanies = function () {
                $http.get(Global.Configuration.serviceHost + 'companies/summary').success(function (result) {
                    if (angular.isDefined($scope.currentUser) && $scope.currentUser.lastUsedCompanyId != null)
                        result = Enumerable.from(result).where(function (a) { return a.value == $scope.currentUser.lastUsedCompanyId; }).toArray();
                    $scope.companies = Global.mergeKeyValuePair($scope.companies, result);
                });
            };
            $scope.getCampaigns = function () {
                $http.get(Global.Configuration.serviceHost + 'campaigns/summary').success(function (result) {
                    if (angular.isDefined($scope.currentUser) && $scope.currentUser.lastUsedCompanyId != null)
                        result = Enumerable.from(result).toArray();
                    $scope.campaigns = Global.mergeKeyValuePair($scope.campaigns, result);
                });
            };
            $scope.delete = function () {
                notification.showConfirm('Sei sicuro di voler eliminare l\'utente?').then(function (success) {
                    if (success) {
                        user.delete(function () {
                            $location.path('users');
                        }, function (error) { notification.handleException(error.data); });
                    }
                });
            };
            $scope.save = function () {
                $scope.data.$save().then(function () {
                    notification.showNotify($scope.data.name + ' ' + $scope.data.surname, 'Salvataggio informazioni per l\'utente ' + $scope.data.name + ' ' + $scope.data.surname + ' eseguito con successo!');
                    if (angular.equals(authentication.identity.id, $scope.data.id)) {
                        angular.copy($scope.data, authentication.identity);
                    }
                    if (!$scope.isProfile) {
                        $location.path('users');
                    }
                });
            };
        }).controller('companyManageCtrl', function ($scope, $http, $location, $log, $resource, $routeParams, configurationsUrl, authentication, companiesUrl, notification) {
            var id = $routeParams['id'];
            var companyResource = $resource(companiesUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });
            if (angular.isDefined(id)) {
                companyResource.get(function (result) { $scope.data = result; });
            }
            else {
                $scope.data = new companyResource();
                $scope.data.isEnabled = true;
            }
            $http.get(configurationsUrl + 'modules').success(function (result) {
                $scope.modules = result;
            });
            $http.get(configurationsUrl + 'currencies').success(function (result) {
                $scope.currencies = result;
            });
            $scope.addDepartment = function () {
                if (angular.isUndefined($scope.data.departments) || $scope.data.departments == null) {
                    $scope.data.departments = [];
                }
                $scope.data.departments.push({ name: '', id: 0 });
            };
            $scope.removeDepartment = function (item) {
                var index = $scope.data.departments.indexOf(item);
                $scope.data.departments.splice(index, 1);
            };
            $scope.addworkPlace = function () {
                if (angular.isUndefined($scope.data.workPlaces) || $scope.data.workPlaces == null) {
                    $scope.data.workPlaces = [];
                }
                $scope.data.workPlaces.push({ name: '', id: 0 });
            };
            $scope.removeworkPlace = function (item) {
                var index = $scope.data.workPlaces.indexOf(item);
                $scope.data.workPlaces.splice(index, 1);
            };
            $scope.delete = function () {
                notification.showConfirm('Sei sicuro di voler eliminare l\'azienda ?').then(function (success) {
                    if (success) {
                        companyResource.delete(function () {
                            $location.path('companies');
                        }, function (error) { notification.handleException(error.data); });
                    }
                });
            };
            $scope.save = function () {
                $scope.data.departments = Enumerable.from($scope.data.departments).where(function (r) { return angular.isUndefined(r.isDeleted) || r.isDeleted == false; }).toArray();
                $scope.data.workPlaces = Enumerable.from($scope.data.workPlaces).where(function (r) { return angular.isUndefined(r.isDeleted) || r.isDeleted == false; }).toArray();
                $scope.data.$save().then(function () {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per l\'azienda <b>' + $scope.data.name + '</b> eseguito con successo!');
                    $location.path('companies');
                });
            };
        }).controller('campaignCtrl', function ($scope, $http, $location, $log, $resource, $routeParams, notification, campaignsUrl, catalogsUrl) {
            var id = $routeParams['id'];
            var campaign = $resource(campaignsUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });
            if (angular.isDefined(id)) {
                campaign.get(function (result) {
                    $scope.data = result;
                });
            }
            else {
                $scope.data = new campaign();
                $scope.data.isActive = true;
            }
            $scope.contractTypes = [];
            $scope.getContractTypes = function () {
                $http.get(catalogsUrl + 'summary/contracttype').success(function (result) {
                    $scope.contractTypes = result;
                });
            };
            $scope.getBrands = function () { return $http.get(catalogsUrl + 'summary/brand', { headers: { 'No-Loading': true } }); };
            $scope.getCampaignTypes = function () { return $http.get(catalogsUrl + 'summary/campaigntype', { headers: { 'No-Loading': true } }); };
            $scope.$watch("data.endDate", function (newValue, oldValue) {
                if (angular.isDefined(newValue) && angular.isDefined(oldValue) && newValue.toDateString() != oldValue.toDateString()) {
                    if (newValue < new Date())
                        $scope.data.isActive = false;
                }
            });
            $scope.delete = function () {
                notification.showConfirm('Sei sicuro di voler eliminare la campagna?').then(function (success) {
                    if (success) {
                        campaign.delete(function () {
                            $scope.redirectToPage();
                        }, function (error) { notification.handleException(error.data); });
                    }
                });
            };
            $scope.save = function () {
                $scope.data.$save().then(function () {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per la campagna <b>' + $scope.data.name + '</b> eseguito con successo!');
                    $scope.redirectToPage();
                });
            };
            $scope.redirectToPage = function () {
                $location.path('campaigns');
            };
        }).controller('employeeCtrl', function ($scope, $routeParams, $resource, $http, notification, $location, catalogsUrl, employeesUrl, companiesUrl, breadcrumbs, $route) {
            var id = $routeParams['employeeId'];
            var resource = $resource(employeesUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });
            $scope.genderItems = [{ id: 1, name: 'M' }, { id: 2, name: 'F' }];
            if (angular.isDefined(id)) {
                resource.get(function (result) {
                    $scope.data = result;
                    breadcrumbs.options = { 'Modifica dipendente': 'Modifica dipendente: ' + result.internalCode };
                });
            }
            else {
                $scope.data = new resource();
            }
            $scope.getDocumentTypes = function () { return $http.get(catalogsUrl + 'summary/identitydocument', { headers: { 'No-Loading': true } }); };
            $scope.save = function () {
                $scope.data.$save().then(function () {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per il dipendente <b>' + $scope.data.name + ' ' + $scope.data.surname + '</b> eseguito con successo!');
                    $location.path('employees');
                });
            };
        }).controller('employeeContractsCtrl', function ($scope, $http, $q, contractsUrl, listPageSize) {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = contractsUrl;
            $scope.filters = {};
            $scope.$watch('data.id', function (employeeId) {
                if (employeeId) {
                    $scope.filters.employeeId = employeeId;
                }
            });
        }).controller('employeePositionsCtrl', function ($scope, $http, $q, employeesUrl) {
            $scope.filters = {};
            $scope.$watch('data.id', function (employeeId) {
                if (employeeId) {
                    $http.get(employeesUrl + 'position/list/' + employeeId, { headers: { 'No-Loading': true } }).success(function (result) {
                        $scope.positions = result;
                    });
                }
            });
        }).controller('contractCtrl', function ($scope, $routeParams, $resource, $http, notification, $location, $q, employeesUrl, contractsUrl, configurationsUrl, catalogsUrl, breadcrumbs, $window) {
            var contractId = $routeParams['id'];
            var employeeId = $routeParams['employeeId'];
            $scope.employeeSelected = employeeId != null;
            var contractResource = $resource(contractsUrl + ':id', { id: angular.isDefined(contractId) ? contractId : '@contract.id' }, { save: { method: contractId != null ? "PUT" : "POST" } });
            if (angular.isDefined(contractId)) {
                contractResource.get(function (result) {
                    $scope.contract = result;
                    if ($scope.contract.employeeId > 0)
                        Global.mergeKeyValuePair($scope.employees, [{ key: $scope.contract.employeeName, value: $scope.contract.employeeId }]);
                    if ($scope.contract.type != null)
                        $scope.contractTypes = Global.mergeKeyValuePair($scope.contractTypes, [$scope.contract.type]);
                    if ($scope.contract.closingType != null)
                        $scope.contractClosingTypes = Global.mergeKeyValuePair($scope.contractClosingTypes, [$scope.contract.closingType]);
                    breadcrumbs.options = { 'Modifica contratto': 'Modifica contratto: ' + $scope.contract.internalCode };
                });
            }
            else {
                $scope.contract = new contractResource();
                $scope.contract.employeeId = employeeId != null ? parseInt(employeeId) : null;
            }
            $http.get(employeesUrl + 'summary', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.employees = result;
            });
            $scope.editContractEndDate = function () {
                if (angular.isDefined($scope.contract.endDate) && $scope.contract.endDate < new Date()) {
                    $scope.contract.isActive = false;
                    $scope.contract.closingJustification = 'Scaduto';
                }
            };
            $scope.contractTypes = [];
            $scope.getContractTypes = function () {
                $http.get(catalogsUrl + 'summary/contracttype').success(function (result) {
                    $scope.contractTypes = result;
                });
            };
            $scope.contractClosingTypes = [];
            $scope.getContractClosingTypes = function () {
                $http.get(catalogsUrl + 'summary/contractclosingtype').success(function (result) {
                    $scope.contractClosingTypes = result;
                });
            };
            $scope.delete = function () {
                notification.showConfirm('Sei sicuro di voler eliminare il contratto?').then(function (success) {
                    if (success) {
                        contractResource.delete(function () {
                            $window.history.back();
                        });
                    }
                });
            };
            // Files
            $scope.options = {
                autoUpload: true,
                singleFileUploads: true,
                url: configurationsUrl + 'attachments/upload',
                acceptFileTypes: /(\.|\/)(pdf|xps|mp3|wav)$/i
            };
            /* fase 3: recupero li tipi allegati */
            $http.get(Global.Configuration.serviceHost + 'catalogs/attachmenttype').success(function (result) {
                $scope.attachmentTypes = result;
            });
            $scope.selectFile = function (item) { $scope.currentAttachment = item; };
            $scope.$on('fileuploadprocessdone', function (e, data) {
                data.submit().success(function (result) {
                    if (angular.isDefined($scope.currentAttachment)) {
                        $scope.currentAttachment.content = result.content;
                        $scope.currentAttachment.contentType = result.contentType;
                        $scope.currentAttachment.contentLength = result.contentLength;
                        $scope.currentAttachment.name = result.name;
                    }
                });
            });
            $scope.invalidUploadFile = function () {
                if (angular.isDefined($scope.contract) && angular.isDefined($scope.contract.attachments) && $scope.contract.attachments != null) {
                    var result = Enumerable.from($scope.contract.attachments).where(function (r) { return r.id == 0 && r.content == null; }).any();
                    return result;
                }
                return false;
            };
            $scope.addAttachment = function () {
                if (angular.isUndefined($scope.contract.attachments) || $scope.contract.attachments == null) {
                    $scope.contract.attachments = [];
                }
                $scope.contract.attachments.push({ id: 0 });
            };
            $scope.removeAttachment = function (item) {
                if (angular.isDefined(item)) {
                    var index = $scope.contract.attachments.indexOf(item);
                    $scope.contract.attachments.splice(index, 1);
                }
            };
            $scope.download = function (item) {
                var deffered = $q.defer();
                $http.get(contractsUrl + 'attachments/download', { params: { id: item.id, contractId: $scope.contract.id }, responseType: "arraybuffer" }).success(function (data) { deffered.resolve(data); }).catch(function (error) { deffered.reject(error); });
                return deffered.promise;
            };
            $scope.$on('fileuploadprocessfail', function (e, data) {
                notification.showError("Non è stato possibile allegare il documento!");
            });
            $scope.save = function () {
                $scope.contract.$save().then(function (result) {
                    notification.showNotify('Contratto ' + result.internalCode, 'Salvataggio contratto ' + result.internalCode + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            };
            $scope.redirectToPage = function () {
                if (employeeId) {
                    $location.path('employees/edit/' + employeeId);
                }
                else {
                    $location.path('contracts');
                }
            };
        }).controller('employeePositionCtrl', function ($scope, $routeParams, $resource, $http, notification, $location, $q, employeesUrl, contractsUrl, configurationsUrl, catalogsUrl, breadcrumbs, $window, companiesUrl, campaignsUrl) {
            var positionId = $routeParams['id'];
            var employeeId = $routeParams['employeeId'];
            $scope.employeeSelected = employeeId != null;
            var positionResource = $resource(employeesUrl + 'position/:id', { id: angular.isDefined(positionId) ? positionId : '@positionId' }, { save: { method: positionId != null ? "PUT" : "POST" } });
            if (angular.isDefined(positionId)) {
                positionResource.get(function (result) {
                    $scope.data = result;
                });
            }
            else {
                $scope.data = new positionResource();
                $scope.data.employee = {
                    value: employeeId
                };
            }
            $scope.delete = function () {
                notification.showConfirm('Sei sicuro di voler eliminare la collocazione del dipendente?').then(function (success) {
                    if (success) {
                        positionResource.delete(function () {
                            $window.history.back();
                        });
                    }
                });
            };
            $scope.$watch('data.department.value', function (value) {
                if ($scope.data && $scope.data.department && value) {
                    $scope.data.department.type = null;
                    $http.get(companiesUrl + 'department/' + value, { headers: { 'No-Loading': true } }).success(function (result) {
                        $scope.data.department.type = result.type;
                    });
                }
            });
            $scope.getPersonsInCharge = function () { return $http.get(employeesUrl + 'personsincharge', { headers: { 'No-Loading': true } }); };
            $scope.getDepartments = function () { return $http.get(companiesUrl + 'departments', { headers: { 'No-Loading': true } }); };
            $scope.getWorkPlaces = function () { return $http.get(companiesUrl + 'workplaces', { headers: { 'No-Loading': true } }); };
            $scope.getPersonInCharge = function (item) {
                var departmentType = 0;
                if ($scope.data.department.type == dto.DepartmentTypeDto.Operator)
                    departmentType = dto.DepartmentTypeDto.TeamLeader;
                else if ($scope.data.department.type == dto.DepartmentTypeDto.TeamLeader)
                    departmentType = dto.DepartmentTypeDto.FloorManager;
                else
                    departmentType = dto.DepartmentTypeDto.Generic;
                return $http.get(employeesUrl + 'personsincharge/?departmentType=' + departmentType + '&campaignId=' + item.campaign.value, { headers: { 'No-Loading': true } });
                //if ($scope.data.department.type == dto.DepartmentTypeDto.Operator) {
                //    return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.TeamLeader + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
                //}
                //if ($scope.data.department.type == dto.DepartmentTypeDto.TeamLeader) {
                //    return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.FloorManager + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
                //}
                //return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.Generic + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
            };
            $scope.getGenericEmployees = function () {
                return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.Generic, { headers: { 'No-Loading': true } });
            };
            $scope.getCampaigns = function () { return $http.get(campaignsUrl + 'summary', { headers: { 'No-Loading': true } }); };
            $scope.save = function () {
                $scope.data.$save().then(function (result) {
                    notification.showNotify('Collocazione', 'Salvataggio eseguito con successo!');
                    $window.history.back();
                });
            };
            $scope.filters = {
                isActive: ''
            };
            $scope.$watch('data.campaignAssociations', function (items) {
                angular.forEach(items, function (item) {
                    if (item.campaign && item.campaign.value == null) {
                        item.campaignItem = null;
                    }
                    if (item.campaign && item.campaign.value != null && (item.campaignItem == null || item.campaignItem.id != item.campaign.value)) {
                        $http.get(campaignsUrl + '/' + item.campaign.value, { headers: { 'No-Loading': true } }).success(function (campaignItem) {
                            item.campaignItem = campaignItem;
                        });
                    }
                });
            }, true);
            $scope.getIsActive = (function (item) {
                if (item && item.startDate) {
                    if (item.endDate == null)
                        return true;
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    return item.startDate <= currentDate && item.endDate >= currentDate;
                }
                return null;
            });
            $scope.addAssociation = function () {
                $scope.filters = null;
                if ($scope.data && $scope.data.campaignAssociations == null)
                    $scope.data.campaignAssociations = [];
                $scope.data.campaignAssociations.push({ isActive: true });
            };
            $scope.removeAssociation = function (item) {
                notification.showConfirm('Sei sicuro di voler eliminare l\'associazione alla campagna?').then(function (success) {
                    if (success) {
                        var index = $scope.data.campaignAssociations.indexOf(item);
                        $scope.data.campaignAssociations.splice(index, 1);
                    }
                });
            };
        }).controller('tablesCtrl', function ($scope, $location, $resource, $routeParams, catalogsUrl, notification) {
            $scope.itemToSave = {};
            var catalog = $resource(catalogsUrl + ':catalogType/:id', { catalogType: '@catalogType', id: '@id' });
            $scope.setTable = function (table) {
                $scope.table = table;
            };
            $scope.$watch('table', function (newValue) {
                if (angular.isDefined(newValue) && angular.isString(newValue) && newValue != '') {
                    catalog.query({ catalogType: newValue }, function (result) {
                        if (angular.isDefined(result) && angular.isArray(result)) {
                            $scope.items = result;
                        }
                    }, function (error) { notification.handleException(error.data); });
                }
            });
            $scope.addItem = function () {
                if (angular.isUndefined($scope.items) || $scope.items == null) {
                    $scope.items = [];
                }
                var newItem = (new catalog());
                newItem.isNew = true;
                newItem.catalogType = $scope.table;
                $scope.items.push(newItem);
            };
            $scope.cancel = function (item) {
                item.isEdit = false;
                if (item.isNew) {
                    var index = $scope.items.indexOf(item);
                    $scope.items.splice(index, 1);
                }
                else
                    angular.copy(item.oldValue, item);
            };
            $scope.saveItem = function (item) {
                item.$save().then(function (result) {
                });
            };
            $scope.removeItem = function (item) {
                notification.showConfirm('Sei sicuro di voler eliminare la voce?').then(function (success) {
                    if (success) {
                        item.$delete({ id: item.id }).then(function () {
                            var index = $scope.items.indexOf(item);
                            $scope.items.splice(index, 1);
                        });
                    }
                });
            };
            $scope.editItem = function (item) {
                item.oldValue = {};
                angular.copy(item, item.oldValue);
                item.isEdit = true;
            };
            $scope.setTable('identitydocument');
        }).controller('registrationCtrl', function ($scope, $resource, notification, $http, listPageSize, employeesUrl, catalogsUrl, campaignsUrl, companiesUrl, configurationsUrl, $q, registrationsUrl, $log, $modal, $filter) {
            $scope.pageSize = 20;
            $scope.resourceUrl = registrationsUrl;
            $scope.filters = {
                date: new Date()
            };
            //$scope.find = (registrationForm, filterForm) => {
            //    filterForm.$dirty = false;
            //    if (registrationForm.$dirty) {
            //        notification.showConfirm("Attenzione sono state apportate delle modifiche ad una o più registrazioni. Si avvisa che effettuando una nuova ricerca eventuali modifiche apportate non verranno salvate. Si desidera continuare con la ricerca SENZA SALVARE le modifiche attuali?")
            //            .then((result: boolean) => {
            //                if (result) {
            //                    performSearch();
            //                }
            //            });
            //    } else {
            //        performSearch();
            //    }
            //}
            //function performSearch() {
            //    $scope.items = null;
            //    if ($scope.filters) {
            //        $http.get(registrationsUrl, { params: $scope.filters }).success((result: any) => {
            //            $scope.items = result;
            //        });
            //    }
            //}
            $scope.expandAll = function () {
                if ($scope.items)
                    angular.forEach($scope.items, function (element) { element.collapsed = false; });
            };
            $scope.collapseAll = function () {
                if ($scope.items)
                    angular.forEach($scope.items, function (element) { element.collapsed = true; });
            };
            $scope.selectAll = function () {
                $scope.expandAll();
                if ($scope.items) {
                    var campaigns = Enumerable.from($scope.items).selectMany(function (r) { return r.campaignsAssociations; }).selectMany(function (c) { return c.details; });
                    angular.forEach(campaigns, function (element) { element.isSelected = true; });
                }
            };
            $scope.deselectAll = function () {
                if ($scope.items) {
                    var campaigns = Enumerable.from($scope.items).selectMany(function (r) { return r.campaignsAssociations; }).selectMany(function (c) { return c.details; });
                    angular.forEach(campaigns, function (element) { element.isSelected = false; });
                }
            };
            $scope.getCampaigns = function () {
                $http.get(campaignsUrl + 'summary', { headers: { 'No-Loading': true } }).success(function (result) {
                    $scope.campaigns = result;
                });
            };
            $scope.getDepartments = function () {
                $http.get(companiesUrl + 'departments', { headers: { 'No-Loading': true } }).success(function (result) {
                    $scope.departments = result;
                });
            };
            $scope.getTeamLeaders = function () {
                $http.get(employeesUrl + 'personsincharge', { headers: { 'No-Loading': true } }).success(function (result) {
                    $scope.teamLeaders = result;
                });
            };
            $scope.getWorkPlaces = function () { return $http.get(companiesUrl + 'workplaces', { headers: { 'No-Loading': true } }); };
            $scope.getAbsenceTypes = function () {
                return $http.get(catalogsUrl + 'absencetype', { headers: { 'No-Loading': true } });
            };
            $scope.addRegistration = function (ca, er) {
                if (ca) {
                    if (ca.details == null) {
                        ca.details = [];
                    }
                    var detail = {
                        workPlace: er.workPlaceDefault
                    };
                    ca.details.push(detail);
                }
            };
            $scope.removeRegistration = function (ca, re) {
                if (ca && re) {
                    var index = ca.details.indexOf(re);
                    if (index >= 0) {
                        ca.details.splice(index, 1);
                    }
                }
            };
            $scope.isCompleted = function (item) {
                var completed = true;
                if (item) {
                    angular.forEach(item.campaignsAssociations, function (cAss) {
                        completed = Enumerable.from(cAss.details).any(function (a) { return a.isAbsence == true || (a.enterTime != null && a.exitTime != null); });
                        if (!completed)
                            return completed;
                    });
                }
                return completed;
            };
            $scope.getSelected = function () {
                if ($scope.items) {
                    return Enumerable.from($scope.items).selectMany(function (r) { return r.campaignsAssociations; }).selectMany(function (c) { return c.details; }).where(function (r) { return r.isSelected; }).toArray();
                }
                return [];
            };
            $scope.setEntranceDate = function (registrationForm) {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    openSelectDateTimeModal().then(function (selectedDateTime) {
                        var message = sprintf('Si è sicuri di voler impostare l\'orario di INGRESSO %1$s per tutte le voci selezionate?', $filter('date')(selectedDateTime, 'HH:mm'), selectedItems.length);
                        notification.showConfirm(message).then(function (result) {
                            if (result) {
                                angular.forEach(selectedItems, function (ele) {
                                    if (!ele.isAbsence)
                                        ele.enterTime = selectedDateTime;
                                });
                            }
                        });
                    });
                }
            };
            $scope.setExitDate = function (registrationForm) {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    openSelectDateTimeModal().then(function (selectedDateTime) {
                        var message = sprintf('Si è sicuri di voler impostare l\'orario di USCITA %1$s per tutte le voci selezionate?', $filter('date')(selectedDateTime, 'HH:mm'), selectedItems.length);
                        notification.showConfirm(message).then(function (result) {
                            if (result) {
                                angular.forEach(selectedItems, function (ele) {
                                    if (!ele.isAbsence)
                                        ele.exitTime = selectedDateTime;
                                });
                            }
                        });
                    });
                }
            };
            $scope.setAbsence = function (registrationForm) {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    var message = sprintf('Si è sicuri di voler impostare l\'assenza per tutte le voci selezionate?. Si avvisa che, per le voci selezionate, eventuali presenze già registrate verranno sostituite con l\'assenza');
                    notification.showConfirm(message).then(function (result) {
                        if (result) {
                            angular.forEach(selectedItems, function (ele) {
                                ele.isAbsence = true;
                                ele.enterTime = ele.exitTime = null;
                            });
                        }
                    });
                }
            };
            $scope.save = function (registrationForm) {
                if ($scope.items && $scope.items.length > 0) {
                    var message = sprintf('Si è sicuri di voler confermare le registrazioni del %1$s ?', $filter('date')($scope.items[0].date, 'dd/MM/yyyy'));
                    notification.showConfirm(message).then(function (result) {
                        if (result) {
                            $http.post(registrationsUrl, $scope.items).success(function (e) {
                                registrationForm.$dirty = false;
                                notification.showNotify('Salvataggio', "Registrazioni salvate con successo");
                            });
                        }
                    });
                }
            };
            function openSelectDateTimeModal() {
                var deffer = $q.defer();
                var modalInstance = $modal.open({
                    templateUrl: '/app/backoffice/views/presences/_selectDateTime.html',
                    controller: 'selectDateTimeCtrl',
                    size: 'sm',
                });
                modalInstance.result.then(function (selectedDateTime) {
                    deffer.resolve(selectedDateTime);
                }, function () { deffer.reject(); });
                return deffer.promise;
            }
            //performSearch();
        })
            .controller('selectDateTimeCtrl', function ($scope, $modalInstance) {
            $scope.ok = function (formOra) {
                if (formOra.$valid) {
                    $modalInstance.close($scope.date);
                }
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        })
            .controller('dashboardCtrl', function ($scope, $http, $resource, dashboardUrl) {
            $scope.filters = {};
            $scope.filters.endDate = new Date();
            $scope.filters.startDate = new Date($scope.filters.endDate.getFullYear(), 1, 1);
            $scope.$watch("filters.endDate", function (newValue, oldValue) {
                $scope.getCampaignsHours();
            });
            $scope.resetDateRange = function () {
                $scope.filters.startDate = null;
                $scope.filters.endDate = null;
            };
            $http.get(dashboardUrl + 'withoutcontract', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.employeeWithoutContract = result;
            });
            $http.get(dashboardUrl + 'withcontract', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.employeeWithContract = result;
            });
            $http.get(dashboardUrl + 'withnotvalidposition', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.withnotvalidposition = result;
            });
            $http.get(dashboardUrl + 'departmentactiveemployees', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.departmentactiveemployees = result;
            });
            $http.get(dashboardUrl + 'campaignactiveemployees', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.campaignactiveemployees = result;
            });
            $http.get(dashboardUrl + 'incompleteandmissingregistrations', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.incompleteandmissingregistrations = result;
            });
            $http.get(dashboardUrl + 'incompleteandmissingregistrations', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.incompleteandmissingregistrations = result;
            });
            $http.get(dashboardUrl + 'negativeturnover', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.negativeturnover = result;
            });
            $http.get(dashboardUrl + 'positiveturnover', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.positiveturnover = result;
            });
            $http.get(dashboardUrl + 'currentmonthnegativeturnover', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.currentmonthnegativeturnover = result;
            });
            $http.get(dashboardUrl + 'currentmonthpositiveturnover', { headers: { 'No-Loading': true } }).success(function (result) {
                $scope.currentmonthpositiveturnover = result;
            });
            $scope.getCampaignsHours = function () {
                //$http.get(reportsUrl + 'campaignsHours', { params: { startDate: $scope.filters.startDate, endDate: $scope.filters.endDate } })
                //    .success((result: dto.IChart) => {
                //        var series = Enumerable.from(result.series);
                //        var ticks = series.select(s => s.name).toArray();
                //        $scope.campaignsHoursChart = {
                //            header: result.header,
                //            description: result.description,
                //            //data: [{ label: "Foo", data: [[2, 1]] },
                //            //    { label: "Bar", data: [[2, 13], [4, 11], [6, -7]] }
                //            //],
                //            data: series.select(s => <any>{
                //                label: s.name,
                //                data: Enumerable.from(s.values).select(r => [r.x, r.y]).toArray()
                //            }).toArray(),
                //            options: {
                //                colors: ["#f35958", "#3db9af"],
                //                series: {
                //                    bars: {
                //                        show: true,
                //                        fill: 0.1,
                //                        barwidth: 20
                //                    },
                //                    shadowSize: 0
                //                },
                //                grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 }, color: "rgba(0,0,0,0.2)" },
                //                tooltip: true,
                //                xaxis: {
                //                    show: true,
                //                    position: "bottom",
                //                    ticks: ticks,
                //                },
                //            }
                //        }
                //    });
                return null;
            };
            $scope.getCampaignsHours();
        })
            .controller('reportsCtrl', function ($scope, $filter, $resource, $q, employeesUrl, notification, $http, reportsUrl) {
            $scope.filters = {};
            $scope.filtersS = {};
            $scope.filtersA = {};
            $scope.filtersTO = {};
            $scope.filtersRE = {};
            $scope.executeOperators = function () {
                $http.get(reportsUrl + 'operatorsjobhours', { params: $scope.filtersO }).success(function (data) {
                    download(data, "Report ore operatore.xml");
                });
            };
            $scope.executeEmployees = function () {
                $http.get(reportsUrl + 'employeesjobhours', { params: $scope.filtersE }).success(function (data) {
                    download(data, "Report ore dipendente.xml");
                });
            };
            $scope.executeEmployeesSheet = function () {
                var filterToPass = {};
                angular.copy($scope.filtersS, filterToPass);
                if (filterToPass.employeeId != null)
                    filterToPass.employeeId = filterToPass.employeeId.value;
                $http.get(reportsUrl + 'employeessheet', { params: filterToPass }).success(function (data) {
                    download(data, "Scheda dipendente.xml");
                });
            };
            $scope.getEmployees = function () { return $http.get(employeesUrl + 'summary'); };
            function download(data, reportname) {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                var blob = new Blob([data], { type: 'application/octet-stream' });
                var urlCreator = window.URL || window.webkitURL;
                var objectUrl = urlCreator.createObjectURL(blob);
                a.href = objectUrl;
                a.download = reportname;
                a.click();
                URL.revokeObjectURL(objectUrl);
            }
            $scope.getkvpfromenum = function (enumType) {
                var kvparray = [];
                Object.keys(enumType).map(function (value) {
                    if (typeof (enumType[value]) == "string")
                        kvparray.push({ key: enumType[value], value: value });
                }, {});
                return kvparray;
            };
            $scope.absenteeismReports = [];
            $scope.turnoverReports = [];
            $scope.reportFormatTypes = $scope.getkvpfromenum(dto.ReportFormatTypeDto);
            $scope.getAvailableTurnoverReports = function () {
                return $http.get(reportsUrl + 'availableturnoverreports', { headers: { 'No-Loading': true } }).success(function (data) {
                    $scope.availableturnoverreports = data;
                });
            };
            $scope.getAvailableAbsenteeismReports = function () {
                return $http.get(reportsUrl + 'availableabsenteeismreports', { headers: { 'No-Loading': true } }).success(function (data) {
                    $scope.availableabsenteeismreports = data;
                });
            };
            $scope.$watch("filters.absenteeismReportId.value", function (newValue) {
                if (newValue) {
                    $scope.absenteeismReportDescription = $filter('filter')($scope.availableabsenteeismreports, { value: newValue })[0].description;
                }
                else {
                    $scope.absenteeismReportDescription = '';
                }
            });
            $scope.$watch("filters.turnoverReportId.value", function (newValue) {
                if (newValue) {
                    $scope.turnoverReportDescription = $filter('filter')($scope.availableturnoverreports, { value: newValue })[0].description;
                }
                else {
                    $scope.turnoverReportDescription = '';
                }
            });
            $scope.years = [];
            $scope.months = [];
            $scope.$watch("filters.year.value", function (newValue) {
                if (newValue) {
                    $scope.updatemonths(newValue);
                }
                else {
                    $scope.months = [];
                }
            });
            $scope.updateyears = function () {
                $scope.years = [];
                for (var y = 2015; y <= (new Date()).getFullYear(); y++) {
                    $scope.years.push({
                        key: y, value: y
                    });
                }
            };
            $scope.updatemonths = function (y) {
                var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
                var month = (new Date()).getMonth();
                var year = (new Date()).getFullYear();
                $scope.months = [];
                for (var m = 0; m < 12; m++) {
                    if (y < year || (y == year && m <= month))
                        $scope.months.push({ key: monthNames[m], value: m + 1 });
                }
            };
            $scope.httpgetsimulate = function () {
                var promise = {
                    success: function (n) { return n; },
                    error: function (n) { return n; },
                    then: function (n) { return n; },
                };
                return promise;
            };
            $scope.executeAbsenteeismReport = function () {
                var filterToPass = {};
                angular.copy($scope.filtersA, filterToPass);
                if (filterToPass.absenteeismReportId != null)
                    filterToPass.absenteeismReportId = filterToPass.absenteeismReportId.value;
                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;
                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;
                $http.get(reportsUrl + 'absenteeism', { params: filterToPass, responseType: "arraybuffer" }).success(function (data, status, headers, config) {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            };
            $scope.executeTurnoverReport = function () {
                var filterToPass = {};
                angular.copy($scope.filtersTO, filterToPass);
                if (filterToPass.turnoverReportId != null)
                    filterToPass.turnoverReportId = filterToPass.turnoverReportId.value;
                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;
                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;
                $http.get(reportsUrl + 'turnover', { params: filterToPass, responseType: "arraybuffer" }).success(function (data, status, headers, config) {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            };
            $scope.executeRegistrationErrorsReport = function () {
                var filterToPass = {};
                angular.copy($scope.filtersRE, filterToPass);
                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;
                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;
                if (filterToPass.month != null)
                    filterToPass.month = filterToPass.month.value;
                $http.get(reportsUrl + 'registrationerrors', { params: filterToPass, responseType: "arraybuffer" }).success(function (data, status, headers, config) {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            };
            $scope.resetDateRange = function (filters) {
                filters.startDate = null;
                filters.endDate = null;
            };
        })
            .controller('configurationCtrl', function ($scope, $resource, configurationsUrl, notification) {
            var resource = $resource(configurationsUrl + 'system');
            resource.get(function (result) { $scope.data = result; });
            $scope.save = function () {
                $scope.data.$save().then(function () {
                    notification.showNotify($scope.data.name, 'Salvataggio configurazione eseguito con successo!');
                });
            };
        })
            .controller('changeLogCtrl', function ($scope, $http) {
            $http.get('/content/changelog.json', { cache: false }).success(function (result) {
                $scope.items = result;
            });
        });
    })(Controllers = BackOfficeApp.Controllers || (BackOfficeApp.Controllers = {}));
})(BackOfficeApp || (BackOfficeApp = {}));
//# sourceMappingURL=controllers.js.map