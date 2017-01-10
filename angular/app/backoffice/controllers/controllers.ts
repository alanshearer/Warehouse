import u = Authentication;
import n = Notification;

module BackOfficeApp.Controllers {

    interface IMainViewModel extends angular.IScope {
        isAuthenticated: boolean;
        breadcrumbs: any;
        getBodyClass: () => string;
        currentUser: dto.IUserToken;
        application: {};
        changeCompany: (company: any) => void;
        refreshPage: () => void;
        logout: () => void
    }

    enum LoginViews {
        Signin,
        ResetPassword,
        ChangePassword
    }

    interface ILoginViewModel extends angular.IScope {
        changeView(view: LoginViews): any;
        currentView: string;
        credential: ICredential;
    }

    interface ICredential {
        username: string
        password: string
    }

    interface ISignInViewModel extends ILoginViewModel {
        signin(): void;
    }

    interface IForgotPasswordViewModel extends ILoginViewModel {
        resetPassword(eMail: string): void;
    }

    interface IChangePasswordViewModel extends ILoginViewModel {
        changePassword(newpassword: string): void;
    }

    interface IPaginationViewModel<T> extends angular.IScope {
        items: T[]
        pageSize: number
        pageCount: number
        totalItems: number
        resourceUrl: string
        filters: any
    }

    interface IUsersViewModel extends IPaginationViewModel<dto.IUserList> {
        permission: dto.IUserPermission;
        checkIfShowColumn: (column: string) => boolean;
        resetDateRange: () => void;
        downloadXls: () => angular.IPromise<any>;
        currentUser: dto.IUserToken;
        cache: any;
    }

    interface ICompaniesViewModel extends IPaginationViewModel<dto.ICompanyList> {
        downloadXls: () => any
    }

    interface IKeyValuePairSelectable extends dto.IKeyValuePair {
        selected: boolean
    }

    interface IManageViewModel<T> extends angular.IScope {
        data: T;
        save: () => void;
        delete: () => void;
    }



    interface IEditableCatalog extends dto.ICatalog {
        isEdit: boolean
        isNew: boolean;
        oldValue: any;
    }

    angular.module("backofficeApp.Controllers", ["authentication", "notification", "ngResource", "filters", "ui.bootstrap"])
        .constant('usersUrl', Global.Configuration.serviceHost + 'users/')
        .constant('companiesUrl', Global.Configuration.serviceHost + 'companies/')
        .constant('registrationsUrl', Global.Configuration.serviceHost + 'registrations/')
        .constant('campaignsUrl', Global.Configuration.serviceHost + 'campaigns/')
        .constant('dashboardUrl', Global.Configuration.serviceHost + 'dashboard/')
        .constant('employeesUrl', Global.Configuration.serviceHost + 'employees/')

        /*
         * COSTANTI NUOVA APP
         */
        .constant('suppliersUrl', Global.Configuration.serviceHost + 'suppliers/')
        .constant('categoriesUrl', Global.Configuration.serviceHost + 'categories/')
        .constant('brandsUrl', Global.Configuration.serviceHost + 'brands/')
        .constant('rolesUrl', Global.Configuration.serviceHost + 'roles/')
        .constant('officesUrl', Global.Configuration.serviceHost + 'offices/')
        /*
         * FINE COSTANTI NUOVA APP
         */

        .constant('catalogsUrl', Global.Configuration.serviceHost + 'catalogs/')
        .constant('configurationsUrl', Global.Configuration.serviceHost + 'configurations/')
        .constant('reportsUrl', Global.Configuration.serviceHost + 'reports/')
        .constant("listActiveClass", "btn-primary")
        .constant("listPageSize", 10)

        .controller('mainCtrl', ($scope: IMainViewModel, $rootScope: angular.IRootScopeService, $filter: angular.IFilterService, $location: angular.ILocationService, $route: angular.route.IRouteService,
            notification: Notification.INotificationService, authentication: u.IAuthenticationService<dto.IUserToken>, caching: Caching.ICachingService, breadcrumbs: any, $http: angular.IHttpService, usersUrl: string) => {

            $scope.breadcrumbs = breadcrumbs;

            $scope.isAuthenticated = authentication.isAuthenticated;

            $scope.currentUser = authentication.identity;

            $scope.changeCompany = (company: dto.IUserCompanyRight) => {
                $http.post(usersUrl + 'changecompany', { companyId: company.companyId })
                    .success((result: dto.IUserTokenResponse) => {
                        authentication.renewalToken(result);
                        caching.clearAll();
                        $location.url('/dashboard');
                        $route.reload();
                    });
            };

            $http.get('/content/changelog.json').success((result: any[]) => {
                if (result != null) {
                    $scope.application = {
                        version: result[0].version,
                        date: result[0].date
                    }
                }
            });

            $scope.getBodyClass = () => {
                return $scope.isAuthenticated ? "leftMenu nav-collapse in" : "full-lg";
            }

            $scope.$watch(() => authentication.isAuthenticated, (isAuthenticated: boolean) => {
                $scope.isAuthenticated = isAuthenticated;
            });

            $scope.refreshPage = () => {
                $route.reload();
            }

            $scope.logout = () => {
                authentication.logout();
                $location.url('/login');
            }

        }).config(($httpProvider: any) => {

            $httpProvider.defaults.useXDomain = true;

            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }).controller('loginCtrl', ($scope: any, $location: angular.ILocationService, authentication: u.IAuthenticationService<dto.IUserToken>) => {

            if (authentication.isAuthenticated == true) {
                $location.url('/dashboard');
                return;
            }

            $scope.credential = { username: '', password: '' };

            $scope.changeView = (view: LoginViews) => {
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
            }
            $scope.changeView(LoginViews.Signin);
        })
        .controller("signinCtrl", ($scope: ISignInViewModel, $location: angular.ILocationService, authentication: u.IAuthenticationService<dto.IUserToken>) => {

            $scope.signin = () => {
                authentication.login($scope.credential.username, $scope.credential.password)
                    .then(() => {
                        $location.url('/dashboard');
                    }).catch((error: WebApi.Resources.IException) => {
                        if (error.statusCode == System.Net.HttpStatusCode.BadRequest) {
                            if (error.badRequestType == dto.ValidationExceptionCode.PasswordExpired) {
                                $scope.changeView(LoginViews.ChangePassword);
                                return;
                            }
                        }
                    });
            };
        })
        .controller('forgotPasswordCtrl', ($scope: IForgotPasswordViewModel, $location: angular.ILocationService, notification: n.INotificationService, authentication: u.IAuthenticationService<dto.IUser>) => {

            $scope.resetPassword = (eMail: string) => {
                authentication.resetPassword($scope.credential.username, eMail)
                    .then(() => {
                        notification.showSuccess('Reimpostazione password eseguita correttamente. E\' stata inviata un e-mail all\'indirizzo ' + eMail);
                        $scope.changeView(LoginViews.Signin);
                    });
            };
        })
        .controller('changePasswordCtrl', ($scope: IChangePasswordViewModel, $http: angular.IHttpService, notification: n.INotificationService, usersUrl: string) => {

            $scope.changePassword = (newpassword: string) => {
                $http.post(usersUrl + 'changepassword/', <dto.IChangePasswordParameters>{
                    userName: $scope.credential.username,
                    oldPassword: $scope.credential.password,
                    newPassword: newpassword
                }).then(() => {
                    notification.showSuccess('Cambio password eseguito correttamente. Per proseguire è necessario accedere con la nuova password.');
                    $scope.credential.password = '';
                    $scope.changeView(LoginViews.Signin);
                });
            }
        })

        .controller('usersCtrl', ($scope: IUsersViewModel, usersUrl: string, $http: angular.IHttpService, listPageSize: number, $q: angular.IQService) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = usersUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(usersUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }

        })
        .controller('companiesCtrl', ($scope: ICompaniesViewModel, $http: angular.IHttpService, $q: angular.IQService, companiesUrl: string, listPageSize: number) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = companiesUrl;
            $scope.filters = { isEnabled: true };
            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(companiesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('campaignsCtrl', ($scope: any, $http: angular.IHttpService, $q: angular.IQService, campaignsUrl: string, listPageSize: number) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = campaignsUrl;

            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(campaignsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        }).controller('employeeCampaignsCtrl', ($scope: any, $http: angular.IHttpService, companiesUrl: string, catalogsUrl: string, employeesUrl: string,
            campaignsUrl: string, notification: Notification.INotificationService) => {
        }).controller('employeesCtrl', ($scope: any, $http: angular.IHttpService, $q: angular.IQService, employeesUrl: string, listPageSize: number, companiesUrl: string, campaignsUrl: string) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = employeesUrl;
            $scope.filters = {};

            $scope.getPersonsInCharge = () => { return $http.get(employeesUrl + 'personsincharge', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getDepartments = () => { return $http.get(companiesUrl + 'departments', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getWorkPlaces = () => { return $http.get(companiesUrl + 'workplaces', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getCampaigns = () => { return $http.get(campaignsUrl + 'summary', <any>{ headers: { 'No-Loading': true } }); };

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(employeesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })















        .controller('suppliersCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            suppliersUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = suppliersUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(suppliersUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('officesCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            officesUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = officesUrl;
            $scope.filters = {};
            $scope.filters.officetype_id = 1;
            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(officesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('warehousesCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            officesUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = officesUrl;
            $scope.filters = {};
            $scope.filters.officetype_id = 2;
            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(officesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('categoriesCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            categoriesUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = categoriesUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(categoriesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve([data]); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        }).controller('brandsCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            brandsUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = brandsUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(brandsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        }).controller('rolesCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            rolesUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = rolesUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(rolesUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })











        .controller('userManageCtrl', ($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, $log: angular.ILogService,
            $resource: angular.resource.IResourceService, $routeParams: angular.route.IRouteParamsService, authentication: Authentication.IAuthenticationService<dto.IUserToken>, usersUrl: string, notification: Notification.INotificationService) => {

            $scope.isProfile = $location.path().indexOf('/profile') >= 0;

            var userId = $scope.isProfile ? authentication.identity.id : $routeParams['id'];

            var user = $resource<dto.IUser>(usersUrl + ':id', { id: !angular.isUndefined(userId) ? userId : '@data.id' }, { save: { method: userId != null ? "PUT" : "POST" } });

            $scope.companies = [];
            $scope.campaigns = [];
            $scope.data = {};
            if (!angular.isUndefined(userId)) {
                user.get((result: dto.IUser) => {
                    $scope.data = result;

                    if (result.companiesRights != null) {
                        angular.forEach(result.companiesRights, (item: dto.IUserCompanyRight) => {
                            $scope.companies = Global.mergeKeyValuePair($scope.companies, <dto.IKeyValuePair[]>[{ key: item.companyName, value: item.companyId }]);
                        });
                    }

                    if (result.campaignsRights != null) {
                        angular.forEach(result.campaignsRights, (item: dto.IUserCampaignRight) => {
                            $scope.campaigns = Global.mergeKeyValuePair($scope.campaigns, <dto.IKeyValuePair[]>[{ key: item.campaignName, value: item.campaignId }]);
                        });
                    }

                    $scope.getEntitiesForRoleType();
                }, (error: any) => { notification.handleException(error.data); });
            } else {
                $scope.data = new user();
            }

            $scope.getNextChangePasswordDate = () => {
                var nextChangePasswordDate: Date = null;

                if (angular.isDefined($scope.data.lastChangePasswordDate) && $scope.data.lastChangePasswordDate != null && $scope.data.passwordDay > 0) {

                    nextChangePasswordDate = new Date($scope.data.lastChangePasswordDate.getTime());

                    var dayToAdd = 0;
                    if (angular.isDefined($scope.data.passwordDay)) { dayToAdd = $scope.data.passwordDay; }

                    nextChangePasswordDate.setDate(nextChangePasswordDate.getDate() + dayToAdd);
                }
                return nextChangePasswordDate;
            }


            //            $http.get(usersUrl + 'roles').success((result: dto.UserRole[]) => {
            //                $scope.roles = result;
            //            });

            $scope.removeCompany = (item: dto.IUserCompanyRight) => {
                if (angular.isDefined(item)) {
                    var index = $scope.data.companiesRights.indexOf(item);
                    $scope.data.companiesRights.splice(index, 1);
                }
            }
            $scope.removeCampaign = (item: dto.IUserCampaignRight) => {
                if (angular.isDefined(item)) {
                    var index = $scope.data.campaignsRights.indexOf(item);
                    $scope.data.campaignsRights.splice(index, 1);
                }
            }
            $scope.addCompany = () => {
                if (angular.isUndefined($scope.data.companiesRights) || $scope.data.companiesRights == null) {
                    $scope.data.companiesRights = [];
                }
                $scope.data.companiesRights.push(<dto.IUserCompanyRight>{
                    companyId: null,
                    companyName: null
                });
            }

            $scope.addCampaign = () => {
                if (angular.isUndefined($scope.data.campaignsRights) || $scope.data.campaignsRights == null) {
                    $scope.data.campaignsRights = [];
                }
                $scope.data.campaignsRights.push(<dto.IUserCampaignRight>{
                    campaignId: null,
                    campaignName: null
                });
            }

            $scope.getEntitiesForRoleType = () => {

            }

            $scope.getCompanies = () => {
                $http.get(Global.Configuration.serviceHost + 'companies/summary').success((result: dto.IKeyValuePair[]) => {
                    if (angular.isDefined($scope.currentUser) && $scope.currentUser.lastUsedCompanyId != null)
                        result = Enumerable.from(result).where(a => a.value == $scope.currentUser.lastUsedCompanyId).toArray();

                    $scope.companies = Global.mergeKeyValuePair($scope.companies, result);
                });
            };

            $scope.getCampaigns = () => {
                $http.get(Global.Configuration.serviceHost + 'campaigns/summary').success((result: dto.IKeyValuePair[]) => {
                    if (angular.isDefined($scope.currentUser) && $scope.currentUser.lastUsedCompanyId != null)
                        result = Enumerable.from(result).toArray();

                    $scope.campaigns = Global.mergeKeyValuePair($scope.campaigns, result);
                });
            };

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'utente?').then((success: boolean) => {
                    if (success) {
                        user.delete(() => {
                            $location.path('users');
                        }, (error: any) => { notification.handleException(error.data); });
                    }
                });

            };

            $scope.save = () => {
                (<any>$scope.data).$save().then(() => {
                    notification.showNotify($scope.data.name + ' ' + $scope.data.surname, 'Salvataggio informazioni per l\'utente ' + $scope.data.name + ' ' + $scope.data.surname + ' eseguito con successo!');

                    if (angular.equals(authentication.identity.id, $scope.data.id)) {
                        angular.copy($scope.data, authentication.identity);
                    }

                    if (!$scope.isProfile) {
                        $location.path('users');
                    }
                });
            }
        }).controller('companyManageCtrl', ($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, $log: angular.ILogService,
            $resource: angular.resource.IResourceService, $routeParams: angular.route.IRouteParamsService, configurationsUrl: string,
            authentication: Authentication.IAuthenticationService<dto.IUserToken>, companiesUrl: string, notification: Notification.INotificationService) => {

            var id = $routeParams['id'];

            var companyResource = $resource<dto.ICompany>(companiesUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });


            if (angular.isDefined(id)) {
                companyResource.get((result: dto.ICompany) => { $scope.data = result; });
            } else {
                $scope.data = new companyResource();
                $scope.data.isEnabled = true;
            }

            $http.get(configurationsUrl + 'modules').success((result: dto.IModule[]) => {
                $scope.modules = result;
            });
            $http.get(configurationsUrl + 'currencies').success((result: dto.CurrencyDto[]) => {
                $scope.currencies = result;
            });


            $scope.addDepartment = () => {
                if (angular.isUndefined($scope.data.departments) || $scope.data.departments == null) {
                    $scope.data.departments = [];
                }
                $scope.data.departments.push({ name: '', id: 0 });
            }

            $scope.removeDepartment = (item: any) => {
                var index = $scope.data.departments.indexOf(item);
                $scope.data.departments.splice(index, 1);
            }

            $scope.addworkPlace = () => {
                if (angular.isUndefined($scope.data.workPlaces) || $scope.data.workPlaces == null) {
                    $scope.data.workPlaces = [];
                }
                $scope.data.workPlaces.push({ name: '', id: 0 });
            }

            $scope.removeworkPlace = (item: any) => {
                var index = $scope.data.workPlaces.indexOf(item);
                $scope.data.workPlaces.splice(index, 1);
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'azienda ?').then((success: boolean) => {
                    if (success) {
                        companyResource.delete(() => {
                            $location.path('companies');
                        }, (error: any) => { notification.handleException(error.data); });
                    }
                });

            };

            $scope.save = () => {
                $scope.data.departments = Enumerable.from($scope.data.departments).where((r) => angular.isUndefined((<any>r).isDeleted) || (<any>r).isDeleted == false).toArray();
                $scope.data.workPlaces = Enumerable.from($scope.data.workPlaces).where((r) => angular.isUndefined((<any>r).isDeleted) || (<any>r).isDeleted == false).toArray();
                (<any>$scope.data).$save().then(() => {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per l\'azienda <b>' + $scope.data.name + '</b> eseguito con successo!');
                    $location.path('companies');
                });
            }
        }).controller('campaignCtrl', ($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, $log: angular.ILogService, $resource: angular.resource.IResourceService, $routeParams: angular.route.IRouteService, notification: Notification.INotificationService,
            campaignsUrl: string, catalogsUrl: string) => {

            var id = $routeParams['id'];

            var campaign = $resource<dto.ICampaign>(campaignsUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });

            if (angular.isDefined(id)) {
                campaign.get((result: dto.ICampaign) => {
                    $scope.data = result;
                });
            } else {
                $scope.data = new campaign();
                $scope.data.isActive = true;
            }

            $scope.supplierTypes = [];
            $scope.getContractTypes = () => {
                $http.get(catalogsUrl + 'summary/suppliertype').success((result: dto.IKeyValuePair[]) => {
                    $scope.supplierTypes = result;
                });
            };
            $scope.getBrands = () => { return $http.get(catalogsUrl + 'summary/brand', <any>{ headers: { 'No-Loading': true } }); };
            $scope.getCampaignTypes = () => { return $http.get(catalogsUrl + 'summary/campaigntype', <any>{ headers: { 'No-Loading': true } }); };

            $scope.$watch("data.endDate", (newValue: Date, oldValue: Date) => {
                if (angular.isDefined(newValue) && angular.isDefined(oldValue) && newValue.toDateString() != oldValue.toDateString()) {
                    if (newValue < new Date())
                        $scope.data.isActive = false;
                }
            });

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare la campagna?').then((success: boolean) => {
                    if (success) {
                        campaign.delete(() => {
                            $scope.redirectToPage();
                        }, (error: any) => { notification.handleException(error.data); });
                    }
                });

            };
            $scope.save = () => {
                (<any>$scope.data).$save().then(() => {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per la campagna <b>' + $scope.data.name + '</b> eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('campaigns');
            }

        }).controller('employeeCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService,
            $location: angular.ILocationService, catalogsUrl: string, employeesUrl: string, companiesUrl: string, breadcrumbs: any, $route: angular.route.IRouteService) => {

            var id = $routeParams['employeeId'];
            var resource = $resource<dto.IEmployee>(employeesUrl + ':id', { id: !angular.isUndefined(id) ? id : '@data.id' }, { save: { method: id != null ? "PUT" : "POST" } });

            $scope.genderItems = [{ id: 1, name: 'M' }, { id: 2, name: 'F' }];

            if (angular.isDefined(id)) {
                resource.get((result: dto.IEmployee) => {
                    $scope.data = result;
                    breadcrumbs.options = { 'Modifica dipendente': 'Modifica dipendente: ' + result.internalCode };
                });
            } else {
                $scope.data = new resource();
            }



            $scope.getDocumentTypes = () => { return $http.get(catalogsUrl + 'summary/identitydocument', <any>{ headers: { 'No-Loading': true } }); };


            $scope.save = () => {
                $scope.data.$save().then(() => {
                    notification.showNotify($scope.data.name, 'Salvataggio informazioni per il dipendente <b>' + $scope.data.name + ' ' + $scope.data.surname + '</b> eseguito con successo!');
                    $location.path('employees');
                });
            }

        }).controller('employeeContractsCtrl', ($scope: any, $http: angular.IHttpService, $q: angular.IQService, suppliersUrl: string, listPageSize: number) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = suppliersUrl;

            $scope.filters = {};

            $scope.$watch('data.id', (employeeId: number) => {
                if (employeeId) {
                    $scope.filters.employeeId = employeeId;
                }
            });

        }).controller('employeePositionsCtrl', ($scope: any, $http: angular.IHttpService, $q: angular.IQService, employeesUrl: string) => {

            $scope.filters = {};
            $scope.$watch('data.id', (employeeId: number) => {
                if (employeeId) {
                    $http.get(employeesUrl + 'position/list/' + employeeId, <any>{ headers: { 'No-Loading': true } }).success((result: any) => {
                        $scope.positions = result;
                    });
                }
            });

        })









        .controller('supplierCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            suppliersUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var supplierId = $routeParams['id'];

            var supplierResource = $resource<dto.IContract>(suppliersUrl + ':id', { id: angular.isDefined(supplierId) ? supplierId : '@supplier.id' }, { save: { method: supplierId != null ? "PUT" : "POST" } });

            if (angular.isDefined(supplierId)) {
                supplierResource.get((result: dto.IContract) => {
                    $scope.supplier = result;
                    breadcrumbs.options = { 'Modifica fornitore': 'Modifica fornitore: ' + $scope.supplier.name };
                });
            } else {
                $scope.supplier = new supplierResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il fornitore?').then((success: boolean) => {
                    if (success) {
                        supplierResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.supplier).$save().then((result: any) => {
                    notification.showNotify('Fornitore ' + result.name, 'Salvataggio fornitore ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('suppliers');
            }
        }).controller('supplierCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            suppliersUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var supplierId = $routeParams['id'];

            var supplierResource = $resource<dto.IContract>(suppliersUrl + ':id', { id: angular.isDefined(supplierId) ? supplierId : '@supplier.id' }, { save: { method: supplierId != null ? "PUT" : "POST" } });

            if (angular.isDefined(supplierId)) {
                supplierResource.get((result: dto.IContract) => {
                    $scope.supplier = result;
                    breadcrumbs.options = { 'Modifica fornitore': 'Modifica fornitore: ' + $scope.supplier.name };
                });
            } else {
                $scope.supplier = new supplierResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il fornitore?').then((success: boolean) => {
                    if (success) {
                        supplierResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.supplier).$save().then((result: any) => {
                    notification.showNotify('Fornitore ' + result.name, 'Salvataggio fornitore ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('suppliers');
            }
        }).controller('categoryCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            categoriesUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var categoryId = $routeParams['id'];

            var categoryResource = $resource<dto.IContract>(categoriesUrl + ':id', { id: angular.isDefined(categoryId) ? categoryId : '@category.id' }, { save: { method: categoryId != null ? "PUT" : "POST" } });

            if (angular.isDefined(categoryId)) {
                categoryResource.get((result: dto.IContract) => {
                    $scope.category = result;
                    breadcrumbs.options = { 'Modifica categoria': 'Modifica categoria: ' + $scope.category.name };
                });
            } else {
                $scope.category = new categoryResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare la categoria?').then((success: boolean) => {
                    if (success) {
                        categoryResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.category).$save().then((result: any) => {
                    notification.showNotify('Categoria ' + result.name, 'Salvataggio categoria ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('/categories');
            }

        }).controller('brandCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            brandsUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var brandId = $routeParams['id'];

            var brandResource = $resource<dto.IContract>(brandsUrl + ':id', { id: angular.isDefined(brandId) ? brandId : '@brand.id' }, { save: { method: brandId != null ? "PUT" : "POST" } });

            if (angular.isDefined(brandId)) {
                brandResource.get((result: dto.IContract) => {
                    $scope.brand = result;
                    breadcrumbs.options = { 'Modifica marchio': 'Modifica marchio: ' + $scope.brand.name };
                });
            } else {
                $scope.brand = new brandResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il marchio?').then((success: boolean) => {
                    if (success) {
                        brandResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.brand).$save().then((result: any) => {
                    notification.showNotify('Marchio ' + result.name, 'Salvataggio marchio ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('/brands');
            }

        })
        .controller('officeCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            officesUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var officeId = $routeParams['id'];

            var officeResource = $resource<dto.IContract>(officesUrl + ':id', { id: angular.isDefined(officeId) ? officeId : '@office.id' }, { save: { method: officeId != null ? "PUT" : "POST" } });

            if (angular.isDefined(officeId)) {
                officeResource.get((result: dto.IContract) => {
                    $scope.office = result;
                    breadcrumbs.options = { 'Modifica ufficio': 'Modifica ufficio: ' + $scope.office.name };
                });
            } else {
                $scope.office = new officeResource();
                $scope.office.officetype_id = 1;
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'ufficio?').then((success: boolean) => {
                    if (success) {
                        officeResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.office).$save().then((result: any) => {
                    notification.showNotify('Ufficio ' + result.name, 'Salvataggio ufficio ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('/offices');
            }

        })
            .controller('warehouseCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            officesUrl: string, configurationsUrl: string, breadcrumbs: any, $window: any) => {

            var officeId = $routeParams['id'];

            var officeResource = $resource<dto.IContract>(officesUrl + ':id', { id: angular.isDefined(officeId) ? officeId : '@office.id' }, { save: { method: officeId != null ? "PUT" : "POST" } });

            if (angular.isDefined(officeId)) {
                officeResource.get((result: dto.IContract) => {
                    $scope.office = result;
                    breadcrumbs.options = { 'Modifica magazzino': 'Modifica magazzino: ' + $scope.office.name };
                });
            } else {
                $scope.office = new officeResource();
                $scope.office.officetype_id = 2;
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il magazzino?').then((success: boolean) => {
                    if (success) {
                        officeResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.office).$save().then((result: any) => {
                    notification.showNotify('Magazzino ' + result.name, 'Salvataggio magazzino ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('/warehouses');
            }

        })













        .controller('employeePositionCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            employeesUrl: string, suppliersUrl: string, configurationsUrl: string, catalogsUrl: string, breadcrumbs: any, $window: any, companiesUrl: string, campaignsUrl: string) => {

            var positionId = $routeParams['id'];
            var employeeId = $routeParams['employeeId'];

            $scope.employeeSelected = employeeId != null;

            var positionResource = $resource<dto.IContract>(employeesUrl + 'position/:id', { id: angular.isDefined(positionId) ? positionId : '@positionId' }, { save: { method: positionId != null ? "PUT" : "POST" } });

            if (angular.isDefined(positionId)) {
                positionResource.get((result: dto.IContract) => {
                    $scope.data = result;
                });
            } else {
                $scope.data = new positionResource();
                $scope.data.employee = {
                    value: employeeId
                };
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare la collocazione del dipendente?').then((success: boolean) => {
                    if (success) {
                        positionResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.$watch('data.department.value', (value: number) => {
                if ($scope.data && $scope.data.department && value) {
                    $scope.data.department.type = null;
                    $http.get(companiesUrl + 'department/' + value, <any>{ headers: { 'No-Loading': true } }).success((result: dto.IDepartment) => {
                        $scope.data.department.type = result.type;
                    });
                }
            });

            $scope.getPersonsInCharge = () => { return $http.get(employeesUrl + 'personsincharge', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getDepartments = () => { return $http.get(companiesUrl + 'departments', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getWorkPlaces = () => { return $http.get(companiesUrl + 'workplaces', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getPersonInCharge = (item: dto.ICampaignAssociation) => {
                var departmentType = 0;
                if ($scope.data.department.type == dto.DepartmentTypeDto.Operator)
                    departmentType = dto.DepartmentTypeDto.TeamLeader;
                else if ($scope.data.department.type == dto.DepartmentTypeDto.TeamLeader)
                    departmentType = dto.DepartmentTypeDto.FloorManager;
                else
                    departmentType = dto.DepartmentTypeDto.Generic;

                return $http.get(employeesUrl + 'personsincharge/?departmentType=' + departmentType + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });

                //if ($scope.data.department.type == dto.DepartmentTypeDto.Operator) {
                //    return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.TeamLeader + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
                //}

                //if ($scope.data.department.type == dto.DepartmentTypeDto.TeamLeader) {
                //    return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.FloorManager + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
                //}

                //return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.Generic + '&campaignId=' + item.campaign.value, <any>{ headers: { 'No-Loading': true } });
            };

            $scope.getGenericEmployees = () => {
                return $http.get(employeesUrl + 'summary/?departmentType=' + dto.DepartmentTypeDto.Generic, <any>{ headers: { 'No-Loading': true } });
            };

            $scope.getCampaigns = () => { return $http.get(campaignsUrl + 'summary', <any>{ headers: { 'No-Loading': true } }); }

            $scope.save = () => {
                (<any>$scope.data).$save().then((result: any) => {
                    notification.showNotify('Collocazione', 'Salvataggio eseguito con successo!');
                    $window.history.back();
                });
            }

            $scope.filters = {
                isActive: ''
            };


            $scope.$watch('data.campaignAssociations', (items: any[]) => {
                angular.forEach(items, (item: any) => {
                    if (item.campaign && item.campaign.value == null) {
                        (<any>item).campaignItem = null;
                    }

                    if (item.campaign && item.campaign.value != null && (item.campaignItem == null || item.campaignItem.id != item.campaign.value)) {
                        $http.get(campaignsUrl + '/' + item.campaign.value, <any>{ headers: { 'No-Loading': true } }).success((campaignItem: dto.ICampaign) => {
                            (<any>item).campaignItem = campaignItem;
                        });
                    }
                });
            }, true);

            $scope.getIsActive = ((item: dto.ICampaignAssociation) => {
                if (item && item.startDate) {
                    if (item.endDate == null)
                        return true;

                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    return item.startDate <= currentDate && item.endDate >= currentDate;
                }
                return null;
            });

            $scope.addAssociation = () => {
                $scope.filters = null;
                if ($scope.data && $scope.data.campaignAssociations == null)
                    $scope.data.campaignAssociations = [];

                $scope.data.campaignAssociations.push(<dto.ICampaignAssociation>{ isActive: true });
            }

            $scope.removeAssociation = (item: dto.ICampaignAssociation) => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'associazione alla campagna?').then((success: boolean) => {
                    if (success) {
                        var index = $scope.data.campaignAssociations.indexOf(item);
                        $scope.data.campaignAssociations.splice(index, 1);
                    }
                });
            }



        }).controller('tablesCtrl', ($scope: any, $location: angular.ILocationService, $resource: angular.resource.IResourceService, $routeParams: angular.route.IRouteParamsService,
            catalogsUrl: string, notification: Notification.INotificationService) => {
            $scope.itemToSave = {};
            var catalog = $resource<dto.ICatalog>(catalogsUrl + ':catalogType/:id', { catalogType: '@catalogType', id: '@id' });

            $scope.setTable = (table: string) => {
                $scope.table = table;
            }

            $scope.$watch('table', (newValue: string) => {
                if (angular.isDefined(newValue) && angular.isString(newValue) && newValue != '') {
                    catalog.query({ catalogType: newValue }, (result: IEditableCatalog[]) => {
                        if (angular.isDefined(result) && angular.isArray(result)) {
                            $scope.items = result;
                        }
                    }, (error: any) => { notification.handleException(error.data); });
                }
            });

            $scope.addItem = () => {
                if (angular.isUndefined($scope.items) || $scope.items == null) {
                    $scope.items = [];
                }
                var newItem = <any>(new catalog());
                newItem.isNew = true;
                newItem.catalogType = $scope.table;

                $scope.items.push(newItem);
            }

            $scope.cancel = (item: IEditableCatalog) => {
                item.isEdit = false;
                if (item.isNew) {
                    var index = $scope.items.indexOf(item);
                    $scope.items.splice(index, 1);
                } else
                    angular.copy(item.oldValue, item);

            }

            $scope.saveItem = (item: angular.resource.IResource<dto.ICatalog>) => {
                item.$save().then((result) => {

                });
            }

            $scope.removeItem = (item: IEditableCatalog) => {
                notification.showConfirm('Sei sicuro di voler eliminare la voce?').then((success: boolean) => {
                    if (success) {
                        (<any>item).$delete({ id: item.id }).then(() => {
                            var index = $scope.items.indexOf(item);
                            $scope.items.splice(index, 1);
                        });
                    }
                });
            }

            $scope.editItem = (item: IEditableCatalog) => {
                item.oldValue = {};
                angular.copy(item, item.oldValue);
                item.isEdit = true;
            }

            $scope.setTable('identitydocument');

        }).controller('registrationCtrl', ($scope: any, $resource: angular.resource.IResourceService, notification: Notification.INotificationService,
            $http: angular.IHttpService, listPageSize: number, employeesUrl: string, catalogsUrl: string, campaignsUrl: string, companiesUrl: string,
            configurationsUrl: string, $q: angular.IQService, registrationsUrl: string, $log: angular.ILogService, $modal: any, $filter: angular.IFilterService) => {

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

            $scope.expandAll = () => {
                if ($scope.items)
                    angular.forEach($scope.items, (element) => { element.collapsed = false; });
            }

            $scope.collapseAll = () => {
                if ($scope.items)
                    angular.forEach($scope.items, (element) => { element.collapsed = true; });
            }

            $scope.selectAll = () => {
                $scope.expandAll();
                if ($scope.items) {
                    var campaigns = Enumerable.from($scope.items).selectMany(r => r.campaignsAssociations).selectMany(c => c.details);
                    angular.forEach(campaigns, (element) => { element.isSelected = true; });
                }
            }
            $scope.deselectAll = () => {
                if ($scope.items) {
                    var campaigns = Enumerable.from($scope.items).selectMany(r => r.campaignsAssociations).selectMany(c => c.details);
                    angular.forEach(campaigns, (element) => { element.isSelected = false; });
                }
            }

            $scope.getCampaigns = () => {
                $http.get(campaignsUrl + 'summary', <any>{ headers: { 'No-Loading': true } }).success((result: dto.IKeyValuePair[]) => {
                    $scope.campaigns = result;
                });
            }

            $scope.getDepartments = () => {
                $http.get(companiesUrl + 'departments', <any>{ headers: { 'No-Loading': true } }).success((result: dto.IKeyValuePair[]) => {
                    $scope.departments = result;
                });
            }

            $scope.getTeamLeaders = () => {
                $http.get(employeesUrl + 'personsincharge', <any>{ headers: { 'No-Loading': true } }).success((result: dto.IKeyValuePair[]) => {
                    $scope.teamLeaders = result;
                });
            }


            $scope.getWorkPlaces = () => { return $http.get(companiesUrl + 'workplaces', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getAbsenceTypes = () => {
                return $http.get(catalogsUrl + 'absencetype', <any>{ headers: { 'No-Loading': true } });
            }

            $scope.addRegistration = (ca: dto.ICampaignAssociationRegistration, er: dto.IEmployeeRegistration) => {
                if (ca) {
                    if (ca.details == null) {
                        ca.details = [];
                    }
                    var detail = <dto.IRegistrationDetail>{
                        workPlace: er.workPlaceDefault
                    };

                    ca.details.push(detail);
                }
            }
            $scope.removeRegistration = (ca: dto.ICampaignAssociationRegistration, re: dto.IRegistrationDetail) => {
                if (ca && re) {
                    var index = ca.details.indexOf(re);
                    if (index >= 0) {
                        ca.details.splice(index, 1);
                    }
                }
            }

            $scope.isCompleted = (item: dto.IEmployeeRegistration) => {
                var completed = true;
                if (item) {
                    angular.forEach(item.campaignsAssociations, (cAss: dto.ICampaignAssociationRegistration) => {
                        completed = Enumerable.from(cAss.details).any(a => a.isAbsence == true || (a.enterTime != null && a.exitTime != null));
                        if (!completed) return completed;
                    });
                }
                return completed;
            }

            $scope.getSelected = () => {
                if ($scope.items) {
                    return Enumerable.from($scope.items).selectMany(r => r.campaignsAssociations).selectMany(c => c.details).where(r => r.isSelected).toArray();
                }
                return [];
            }

            $scope.setEntranceDate = (registrationForm) => {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    openSelectDateTimeModal().then((selectedDateTime: Date) => {
                        var message = sprintf('Si è sicuri di voler impostare l\'orario di INGRESSO %1$s per tutte le voci selezionate?', $filter('date')(selectedDateTime, 'HH:mm'), selectedItems.length);
                        notification.showConfirm(message).then((result: boolean) => {
                            if (result) {
                                angular.forEach(selectedItems, (ele: dto.IRegistrationDetail) => {
                                    if (!ele.isAbsence)
                                        ele.enterTime = selectedDateTime;
                                });
                            }
                        });
                    });
                }
            }

            $scope.setExitDate = (registrationForm) => {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    openSelectDateTimeModal().then((selectedDateTime: Date) => {
                        var message = sprintf('Si è sicuri di voler impostare l\'orario di USCITA %1$s per tutte le voci selezionate?', $filter('date')(selectedDateTime, 'HH:mm'), selectedItems.length);
                        notification.showConfirm(message).then((result: boolean) => {
                            if (result) {
                                angular.forEach(selectedItems, (ele: dto.IRegistrationDetail) => {
                                    if (!ele.isAbsence)
                                        ele.exitTime = selectedDateTime;
                                });
                            }
                        });

                    });
                }
            }

            $scope.setAbsence = (registrationForm) => {
                registrationForm.$setDirty();
                var selectedItems = $scope.getSelected();
                if (selectedItems.length > 0) {
                    var message = sprintf('Si è sicuri di voler impostare l\'assenza per tutte le voci selezionate?. Si avvisa che, per le voci selezionate, eventuali presenze già registrate verranno sostituite con l\'assenza');
                    notification.showConfirm(message).then((result: boolean) => {
                        if (result) {
                            angular.forEach(selectedItems, (ele: dto.IRegistrationDetail) => {
                                ele.isAbsence = true;
                                ele.enterTime = ele.exitTime = null;
                            });
                        }
                    });
                }
            }

            $scope.save = (registrationForm) => {
                if ($scope.items && $scope.items.length > 0) {
                    var message = sprintf('Si è sicuri di voler confermare le registrazioni del %1$s ?', $filter('date')($scope.items[0].date, 'dd/MM/yyyy'));
                    notification.showConfirm(message).then((result: boolean) => {
                        if (result) {
                            $http.post(registrationsUrl, $scope.items).success((e) => {
                                registrationForm.$dirty = false;
                                notification.showNotify('Salvataggio', "Registrazioni salvate con successo");
                            });
                        }
                    });
                }
            }

            function openSelectDateTimeModal() {
                var deffer = $q.defer();

                var modalInstance = $modal.open({
                    templateUrl: '/app/backoffice/views/presences/_selectDateTime.html',
                    controller: 'selectDateTimeCtrl',
                    size: 'sm',
                });

                modalInstance.result.then((selectedDateTime: Date) => {
                    deffer.resolve(selectedDateTime);
                }, () => { deffer.reject(); });
                return deffer.promise;
            }

            //performSearch();

        })
        .controller('selectDateTimeCtrl', ($scope: any, $modalInstance: any) => {

            $scope.ok = (formOra) => {
                if (formOra.$valid) {
                    $modalInstance.close($scope.date);
                }
            };

            $scope.cancel = () => {
                $modalInstance.dismiss('cancel');
            };
        })
        .controller('dashboardCtrl', ($scope: any, $http: angular.IHttpService, $resource: angular.resource.IResourceService,
            dashboardUrl: string) => {


            $scope.filters = {};
            $scope.filters.endDate = new Date();
            $scope.filters.startDate = new Date($scope.filters.endDate.getFullYear(), 1, 1);
            $scope.$watch("filters.endDate", (newValue: Date, oldValue: Date) => {
                $scope.getCampaignsHours();
            });

            $scope.resetDateRange = () => {
                $scope.filters.startDate = null;
                $scope.filters.endDate = null;
            }


            $http.get(dashboardUrl + 'withoutsupplier', <any>{ headers: { 'No-Loading': true } }).success((result: number) => {
                $scope.employeeWithoutContract = result;
            });
            $http.get(dashboardUrl + 'withsupplier', <any>{ headers: { 'No-Loading': true } }).success((result: number) => {
                $scope.employeeWithContract = result;
            });
            $http.get(dashboardUrl + 'withnotvalidposition', <any>{ headers: { 'No-Loading': true } }).success((result: number) => {
                $scope.withnotvalidposition = result;
            });
            $http.get(dashboardUrl + 'departmentactiveemployees', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.departmentactiveemployees = result;
            });
            $http.get(dashboardUrl + 'campaignactiveemployees', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.campaignactiveemployees = result;
            });
            $http.get(dashboardUrl + 'incompleteandmissingregistrations', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.incompleteandmissingregistrations = result;
            });

            $http.get(dashboardUrl + 'incompleteandmissingregistrations', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.incompleteandmissingregistrations = result;
            });

            $http.get(dashboardUrl + 'negativeturnover', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.negativeturnover = result;
            });

            $http.get(dashboardUrl + 'positiveturnover', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.positiveturnover = result;
            });

            $http.get(dashboardUrl + 'currentmonthnegativeturnover', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.currentmonthnegativeturnover = result;
            });

            $http.get(dashboardUrl + 'currentmonthpositiveturnover', <any>{ headers: { 'No-Loading': true } }).success(function(result: any) {
                $scope.currentmonthpositiveturnover = result;
            });
            $scope.getCampaignsHours = () => {
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
            }
            $scope.getCampaignsHours();
        })
        .controller('reportsCtrl', ($scope: any, $filter: any, $resource: angular.resource.IResourceService, $q: angular.IQService, employeesUrl: string,
            notification: Notification.INotificationService, $http: angular.IHttpService, reportsUrl: string) => {
            $scope.filters = {};
            $scope.filtersS = {};
            $scope.filtersA = {};
            $scope.filtersTO = {};
            $scope.filtersRE = {};

            $scope.executeOperators = () => {
                $http.get(reportsUrl + 'operatorsjobhours', { params: $scope.filtersO }).success((data: any) => {
                    download(data, "Report ore operatore.xml");
                });
            }

            $scope.executeEmployees = () => {
                $http.get(reportsUrl + 'employeesjobhours', { params: $scope.filtersE }).success((data: any) => {
                    download(data, "Report ore dipendente.xml");
                });
            }

            $scope.executeEmployeesSheet = () => {

                var filterToPass = <any>{};
                angular.copy($scope.filtersS, filterToPass);

                if (filterToPass.employeeId != null)
                    filterToPass.employeeId = filterToPass.employeeId.value;

                $http.get(reportsUrl + 'employeessheet', { params: filterToPass }).success((data: any) => {
                    download(data, "Scheda dipendente.xml");
                });
            }

            $scope.getEmployees = () => { return $http.get(employeesUrl + 'summary'); };

            function download(data: any, reportname: string) {
                var a = <any>document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";

                var blob = new Blob([data], { type: 'application/octet-stream' });
                var urlCreator = (<any>window).URL || (<any>window).webkitURL;

                var objectUrl = urlCreator.createObjectURL(blob);

                a.href = objectUrl;
                a.download = reportname;
                a.click();

                URL.revokeObjectURL(objectUrl);
            }
            $scope.getkvpfromenum = (enumType: any) => {
                var kvparray = new Array();
                Object.keys(enumType).map(function(value) {
                    if (typeof (enumType[value]) == "string")
                        kvparray.push({ key: enumType[value], value: value });
                }, {});
                return kvparray;
            }

            $scope.absenteeismReports = [];
            $scope.turnoverReports = [];
            $scope.reportFormatTypes = $scope.getkvpfromenum(dto.ReportFormatTypeDto);

            $scope.getAvailableTurnoverReports = () => {
                return $http.get(reportsUrl + 'availableturnoverreports', <any>{ headers: { 'No-Loading': true } }).success((data: any) => {
                    $scope.availableturnoverreports = data;
                });
            };
            $scope.getAvailableAbsenteeismReports = () => {
                return $http.get(reportsUrl + 'availableabsenteeismreports', <any>{ headers: { 'No-Loading': true } }).success((data: any) => {
                    $scope.availableabsenteeismreports = data;
                });
            };

            $scope.$watch("filters.absenteeismReportId.value", (newValue: any) => {
                if (newValue) {
                    $scope.absenteeismReportDescription = $filter('filter')($scope.availableabsenteeismreports, { value: newValue })[0].description;
                }
                else {
                    $scope.absenteeismReportDescription = '';
                }
            });
            $scope.$watch("filters.turnoverReportId.value", (newValue: any) => {
                if (newValue) {
                    $scope.turnoverReportDescription = $filter('filter')($scope.availableturnoverreports, { value: newValue })[0].description;
                }
                else {
                    $scope.turnoverReportDescription = '';
                }
            });


            $scope.years = [];
            $scope.months = [];

            $scope.$watch("filters.year.value", (newValue: any) => {
                if (newValue) {
                    $scope.updatemonths(newValue);
                }
                else {
                    $scope.months = [];
                }
            });
            $scope.updateyears = () => {
                $scope.years = [];
                for (var y = 2015; y <= (new Date()).getFullYear(); y++) {
                    $scope.years.push({
                        key: y, value: y
                    });
                }
            }


            $scope.updatemonths = (y: any) => {
                var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
                var month = (new Date()).getMonth();
                var year = (new Date()).getFullYear();
                $scope.months = [];
                for (var m = 0; m < 12; m++) {
                    if (y < year || (y == year && m <= month))
                        $scope.months.push({ key: monthNames[m], value: m + 1 });
                }
            }

            $scope.httpgetsimulate = () => {
                var promise = {
                    success: function(n: any) { return n; },
                    error: function(n: any) { return n; },
                    then: function(n: any) { return n; },
                };
                return promise;
            };

            $scope.executeAbsenteeismReport = () => {
                var filterToPass = <any>{};
                angular.copy($scope.filtersA, filterToPass);

                if (filterToPass.absenteeismReportId != null)
                    filterToPass.absenteeismReportId = filterToPass.absenteeismReportId.value;

                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;

                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;

                $http.get(reportsUrl + 'absenteeism', { params: filterToPass, responseType: "arraybuffer" }).success((data: any, status: any, headers: any, config: any) => {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            }

            $scope.executeTurnoverReport = () => {
                var filterToPass = <any>{};
                angular.copy($scope.filtersTO, filterToPass);

                if (filterToPass.turnoverReportId != null)
                    filterToPass.turnoverReportId = filterToPass.turnoverReportId.value;

                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;

                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;

                $http.get(reportsUrl + 'turnover', { params: filterToPass, responseType: "arraybuffer" }).success((data: any, status: any, headers: any, config: any) => {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            }

            $scope.executeRegistrationErrorsReport = () => {
                var filterToPass = <any>{};
                angular.copy($scope.filtersRE, filterToPass);

                if (filterToPass.reportFormatTypeId != null)
                    filterToPass.reportFormatTypeId = filterToPass.reportFormatTypeId.value;

                if (filterToPass.year != null)
                    filterToPass.year = filterToPass.year.value;

                if (filterToPass.month != null)
                    filterToPass.month = filterToPass.month.value;

                $http.get(reportsUrl + 'registrationerrors', { params: filterToPass, responseType: "arraybuffer" }).success((data: any, status: any, headers: any, config: any) => {
                    var filename = headers('Content-Disposition').match(/filename="(.+)"/)[1];
                    download(data, filename);
                });
            }

            $scope.resetDateRange = (filters: any) => {
                filters.startDate = null;
                filters.endDate = null;
            }
        })

        .controller('configurationCtrl', ($scope: any, $resource: angular.resource.IResourceService, configurationsUrl: string, notification: Notification.INotificationService) => {

            var resource = $resource<dto.IConfiguration>(configurationsUrl + 'system');
            resource.get((result: dto.IConfiguration) => { $scope.data = result; });

            $scope.save = () => {
                (<any>$scope.data).$save().then(() => {
                    notification.showNotify($scope.data.name, 'Salvataggio configurazione eseguito con successo!');
                });
            }

        })
        .controller('changeLogCtrl', ($scope: any, $http: angular.IHttpService) => {

            $http.get('/content/changelog.json', { cache: false }).success((result: any[]) => {
                $scope.items = result;
            });
        })
        ;




}
