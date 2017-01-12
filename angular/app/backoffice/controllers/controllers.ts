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

    interface IKeyValuePairSelectable extends dto.IKeyValuePair {
        selected: boolean
    }

    interface IManageViewModel<T> extends angular.IScope {
        data: T;
        save: () => void;
        delete: () => void;
    }

    angular.module("backofficeApp.Controllers", ["authentication", "notification", "ngResource", "filters", "ui.bootstrap"])
        /*
         * COSTANTI NUOVA APP
         */
        .constant('dashboardUrl', Global.Configuration.serviceHost + 'dashboard/')
        .constant('usersUrl', Global.Configuration.serviceHost + 'users/')
        .constant('suppliersUrl', Global.Configuration.serviceHost + 'suppliers/')
        .constant('categoriesUrl', Global.Configuration.serviceHost + 'categories/')
        .constant('brandsUrl', Global.Configuration.serviceHost + 'brands/')
        .constant('rolesUrl', Global.Configuration.serviceHost + 'roles/')
        .constant('officesUrl', Global.Configuration.serviceHost + 'offices/')
        .constant('modelsUrl', Global.Configuration.serviceHost + 'models/')
        .constant('productsUrl', Global.Configuration.serviceHost + 'products/')
        .constant('ordersUrl', Global.Configuration.serviceHost + 'orders/')
        .constant('shippingsUrl', Global.Configuration.serviceHost + 'shippings/')
        .constant('checksUrl', Global.Configuration.serviceHost + 'checks/')
        .constant('statesUrl', Global.Configuration.serviceHost + 'states/')
        .constant('supportsUrl', Global.Configuration.serviceHost + 'supports/')
        .constant("listActiveClass", "btn-primary")
        .constant("listPageSize", 10)
        /*
         * FINE COSTANTI NUOVA APP
         */
        .controller('mainCtrl', ($scope: IMainViewModel, $rootScope: angular.IRootScopeService, $filter: angular.IFilterService, $location: angular.ILocationService, $route: angular.route.IRouteService,
            notification: Notification.INotificationService, authentication: u.IAuthenticationService<dto.IUserToken>, caching: Caching.ICachingService, breadcrumbs: any, $http: angular.IHttpService, usersUrl: string) => {

            $scope.breadcrumbs = breadcrumbs;

            $scope.isAuthenticated = authentication.isAuthenticated;

            $scope.currentUser = authentication.identity;

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
        .controller('modelsCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            modelsUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = modelsUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(modelsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('productsCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            productsUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = productsUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(productsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('ordersCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            ordersUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = ordersUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(ordersUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })
        .controller('shippingsCtrl', ($scope: any, $resource: angular.resource.IResourceService, $http: angular.IHttpService, $q: angular.IQService, listPageSize: number, notification: Notification.INotificationService,
            shippingsUrl: string) => {

            $scope.pageSize = listPageSize;
            $scope.resourceUrl = shippingsUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(shippingsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }
        })










        .controller('userCtrl', ($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, $log: angular.ILogService,
            $resource: angular.resource.IResourceService, $routeParams: angular.route.IRouteParamsService, authentication: Authentication.IAuthenticationService<dto.IUserToken>, notification: Notification.INotificationService,
            officesUrl: string, usersUrl: string, rolesUrl: string) => {
            $scope.data = {};

            $scope.filters = {};

            $scope.isProfile = $location.path().indexOf('/profile') >= 0;

            var userId = $scope.isProfile ? authentication.identity.id : $routeParams['id'];

            var userResource = $resource<dto.IUser>(usersUrl + ':id', { id: !angular.isUndefined(userId) ? userId : '@data.id' }, { save: { method: userId != null ? "PUT" : "POST" } });
            if (!angular.isUndefined(userId)) {
                userResource.get((result: dto.IUser) => {
                    $scope.data = result;
                }, (error: any) => { notification.handleException(error.data); });
            } else {
                $scope.data = new userResource();
            }

            $scope.filters.officetype_id = 2;
            $scope.getOffices = () => {
                return $http.get(officesUrl + 'kvp', <any>{ headers: { 'No-Loading': true }, params: $scope.filters });
            }
            $scope.getRoles = () => {
                return $http.get(rolesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } });
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

            $scope.removeOffice = (item: dto.IUserOfficeRight) => {
                if (angular.isDefined(item)) {
                    var index = $scope.data.officesRights.indexOf(item);
                    $scope.data.officesRights.splice(index, 1);
                }
            }
            $scope.addOffice = () => {
                if (angular.isUndefined($scope.data.officesRights) || $scope.data.officesRights == null) {
                    $scope.data.officesRights = [];
                }
                $scope.data.officesRights.push(<dto.IUserOfficeRight>{});
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'utente?').then((success: boolean) => {
                    if (success) {
                        userResource.delete(() => {
                            $location.path('users');
                        }, (error: any) => { notification.handleException(error.data); });
                    }
                });

            };

            $scope.save = () => {
                (<any>$scope.data).$save().then(() => {
                    notification.showNotify($scope.data.firstname + ' ' + $scope.data.lastname, 'Salvataggio informazioni per l\'utente ' + $scope.data.firstname + ' ' + $scope.data.lastname + ' eseguito con successo!');

                    if (angular.equals(authentication.identity.id, $scope.data.id)) {
                        angular.copy($scope.data, authentication.identity);
                    }

                    if (!$scope.isProfile) {
                        $location.path('users');
                    }
                });
            }
        })
        .controller('modelCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            modelsUrl: string, brandsUrl: string, categoriesUrl: string, breadcrumbs: any, $window: any) => {

            var modelId = $routeParams['id'];

            var modelResource = $resource<dto.IGenericObject>(modelsUrl + ':id', { id: angular.isDefined(modelId) ? modelId : '@model.id' }, { save: { method: modelId != null ? "PUT" : "POST" } });

            if (angular.isDefined(modelId)) {
                modelResource.get((result: dto.IGenericObject) => {
                    $scope.model = result;
                    breadcrumbs.options = { 'Modifica modello': 'Modifica modello: ' + $scope.model.name };
                });
            } else {
                $scope.model = new modelResource();
            }

            $scope.getBrands = () => { return $http.get(brandsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getCategories = () => { return $http.get(categoriesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il modello?').then((success: boolean) => {
                    if (success) {
                        modelResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.model).$save().then((result: any) => {
                    notification.showNotify('Modello ' + result.name, 'Salvataggio modello ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('models');
            }
        })
        .controller('checksCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService, listPageSize: number,
            checksUrl: string, productsUrl: string, statesUrl: string, breadcrumbs: any, $window: any) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = checksUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(productsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }

            var checkResource = $resource<dto.IGenericObject>(checksUrl, {}, { save: { method: "POST" } });

            $scope.check = new checkResource();

            $scope.getCheckstates = () => { return $http.get(statesUrl + 'check', <any>{ headers: { 'No-Loading': true } }); };

            $scope.saveCheck = (item: any) => {
                $scope.check.product_id = item.product.id;
                $scope.check.workingstate_id = item.productworkingstate.value;
                (<any>$scope.check).$save().then((result: any) => {
                    notification.showNotify('Prodotto ' + item.product.name, 'Controllo prodotto ' + item.product.name + ' eseguito con successo!');
                    var index = $scope.items.indexOf(item);
                    $scope.items.splice(index, 1);
                });
            }
        })
        .controller('supportsCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService, listPageSize: number,
            supportsUrl: string, productsUrl: string, statesUrl: string, breadcrumbs: any, $window: any) => {
            $scope.pageSize = listPageSize;
            $scope.resourceUrl = supportsUrl;
            $scope.filters = {};

            $scope.downloadXls = () => {
                var deffered = $q.defer();
                $http.get(productsUrl + 'xls', { params: $scope.filters }).success((data: any) => { deffered.resolve(data); }).catch((error: any) => { deffered.reject(error); });
                return deffered.promise;
            }

            var supportResource = $resource<dto.IGenericObject>(supportsUrl, {}, { save: { method: "POST" } });

            $scope.support = new supportResource();

            $scope.getSupportstates = () => { return $http.get(statesUrl + 'support', <any>{ headers: { 'No-Loading': true } }); };

            $scope.saveSupport = (item: any) => {
                $scope.support.product_id = item.product.id;
                $scope.support.workingstate_id = item.productworkingstate.value;
                (<any>$scope.support).$save().then((result: any) => {
                    notification.showNotify('Prodotto ' + item.product.name, 'Controllo prodotto ' + item.product.name + ' eseguito con successo!');
                    var index = $scope.items.indexOf(item);
                    $scope.items.splice(index, 1);
                });
            }
        })
        .controller('productCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            productsUrl: string, modelsUrl: string, brandsUrl: string, categoriesUrl: string, officesUrl: string, breadcrumbs: any, $window: any) => {

            var productId = $routeParams['id'];

            var productResource = $resource<dto.IGenericObject>(productsUrl + ':id', { id: angular.isDefined(productId) ? productId : '@product.id' }, { save: { method: productId != null ? "PUT" : "POST" } });

            if (angular.isDefined(productId)) {
                productResource.get((result: dto.IGenericObject) => {
                    $scope.product = result;
                    breadcrumbs.options = { 'Modifica prodotto': 'Modifica prodotto: ' + $scope.product.name };
                });
            } else {
                $scope.product = new productResource();
            }

            $scope.getBrands = () => { return $http.get(brandsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getCategories = () => { return $http.get(categoriesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getModels = () => { return $http.get(modelsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getOffices = () => { return $http.get(officesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il prodotto?').then((success: boolean) => {
                    if (success) {
                        productResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.product).$save().then((result: any) => {
                    notification.showNotify('Prodotto ' + result.name, 'Salvataggio prodotto ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('products');
            }
        })
        .controller('supplierCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            suppliersUrl: string, breadcrumbs: any, $window: any) => {

            var supplierId = $routeParams['id'];

            var supplierResource = $resource<dto.IGenericObject>(suppliersUrl + ':id', { id: angular.isDefined(supplierId) ? supplierId : '@supplier.id' }, { save: { method: supplierId != null ? "PUT" : "POST" } });

            if (angular.isDefined(supplierId)) {
                supplierResource.get((result: dto.IGenericObject) => {
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
            categoriesUrl: string, breadcrumbs: any, $window: any) => {

            var categoryId = $routeParams['id'];

            var categoryResource = $resource<dto.IGenericObject>(categoriesUrl + ':id', { id: angular.isDefined(categoryId) ? categoryId : '@category.id' }, { save: { method: categoryId != null ? "PUT" : "POST" } });

            if (angular.isDefined(categoryId)) {
                categoryResource.get((result: dto.IGenericObject) => {
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
            brandsUrl: string, breadcrumbs: any, $window: any) => {

            var brandId = $routeParams['id'];

            var brandResource = $resource<dto.IGenericObject>(brandsUrl + ':id', { id: angular.isDefined(brandId) ? brandId : '@brand.id' }, { save: { method: brandId != null ? "PUT" : "POST" } });

            if (angular.isDefined(brandId)) {
                brandResource.get((result: dto.IGenericObject) => {
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
            officesUrl: string, breadcrumbs: any, $window: any) => {

            var officeId = $routeParams['id'];

            var officeResource = $resource<dto.IGenericObject>(officesUrl + ':id', { id: angular.isDefined(officeId) ? officeId : '@office.id' }, { save: { method: officeId != null ? "PUT" : "POST" } });

            if (angular.isDefined(officeId)) {
                officeResource.get((result: dto.IGenericObject) => {
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
            
            $scope.getWarehouses = () => { return $http.get(officesUrl + 'kvp', <any>{ headers: { 'No-Loading': true }, params: {officetype_id: 2} }); };

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
            officesUrl: string, breadcrumbs: any, $window: any) => {

            var warehouseId = $routeParams['id'];

            var warehouseResource = $resource<dto.IGenericObject>(officesUrl + ':id', { id: angular.isDefined(warehouseId) ? warehouseId : '@warehouse.id' }, { save: { method: warehouseId != null ? "PUT" : "POST" } });

            if (angular.isDefined(warehouseId)) {
                warehouseResource.get((result: dto.IGenericObject) => {
                    $scope.warehouse = result;
                    breadcrumbs.options = { 'Modifica magazzino': 'Modifica magazzino: ' + $scope.warehouse.name };
                });
            } else {
                $scope.warehouse = new warehouseResource();
                $scope.warehouse.officetype_id = 2;
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare il magazzino?').then((success: boolean) => {
                    if (success) {
                        warehouseResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.save = () => {
                (<any>$scope.warehouse).$save().then((result: any) => {
                    notification.showNotify('Magazzino ' + result.name, 'Salvataggio magazzino ' + result.name + ' eseguito con successo!');
                    $scope.redirectToPage();
                });
            }

            $scope.redirectToPage = () => {
                $location.path('/warehouses');
            }

        })
        .controller('orderCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            ordersUrl: string, suppliersUrl: string, categoriesUrl: string, brandsUrl: string, modelsUrl: string, breadcrumbs: any, $window: any) => {

            var orderId = $routeParams['id'];

            $scope.getSuppliers = () => { return $http.get(suppliersUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            var orderResource = $resource<dto.IGenericObject>(ordersUrl + ':id', { id: angular.isDefined(orderId) ? orderId : '@order.id' }, { save: { method: orderId != null ? "PUT" : "POST" } });

            if (angular.isDefined(orderId)) {
                orderResource.get((result: dto.IGenericObject) => {
                    $scope.order = result;
                });
            } else {
                $scope.order = new orderResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'ordine?').then((success: boolean) => {
                    if (success) {
                        orderResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.getBrands = () => { return $http.get(brandsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getCategories = () => { return $http.get(categoriesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getModels = () => { return $http.get(modelsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.save = () => {
                (<any>$scope.order).$save().then((result: any) => {
                    notification.showNotify('Ordine ' + $scope.order.date, 'Salvataggio eseguito con successo!');
                    $window.history.back();
                });
            }

            $scope.filters = {
                isActive: ''
            };

            $scope.addModel = () => {
                $scope.filters = null;
                if ($scope.order && $scope.order.models == null)
                    $scope.order.models = [];

                $scope.order.models.push(<dto.IGenericObject>{ isActive: true });
            }

            $scope.removeModel = (item: dto.IGenericObject) => {
                notification.showConfirm('Sei sicuro di voler eliminare l\'ordine?').then((success: boolean) => {
                    if (success) {
                        var index = $scope.order.models.indexOf(item);
                        $scope.order.models.splice(index, 1);
                    }
                });
            }
        })
        .controller('shippingCtrl', ($scope: any, $routeParams: angular.route.IRouteService, $resource: angular.resource.IResourceService, $http: angular.IHttpService, notification: Notification.INotificationService, $location: angular.ILocationService, $q: angular.IQService,
            shippingsUrl: string, productsUrl: string, officesUrl: string, categoriesUrl: string, brandsUrl: string, modelsUrl: string, statesUrl: string, breadcrumbs: any, $window: any) => {

            var shippingId = $routeParams['id'];

            $scope.getOffices = () => { return $http.get(officesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };
            $scope.getShippingstates = () => { return $http.get(statesUrl + 'shipping', <any>{ headers: { 'No-Loading': true } }); };

            var shippingResource = $resource<dto.IGenericObject>(shippingsUrl + ':id', { id: angular.isDefined(shippingId) ? shippingId : '@shipping.id' }, { save: { method: shippingId != null ? "PUT" : "POST" } });

            if (angular.isDefined(shippingId)) {
                shippingResource.get((result: dto.IGenericObject) => {
                    $scope.shipping = result;
                });
            } else {
                $scope.shipping = new shippingResource();
            }

            $scope.delete = () => {
                notification.showConfirm('Sei sicuro di voler eliminare la spedizione?').then((success: boolean) => {
                    if (success) {
                        shippingResource.delete(() => {
                            $window.history.back();
                        });
                    }
                });
            };

            $scope.getBrands = () => { return $http.get(brandsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getCategories = () => { return $http.get(categoriesUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getModels = () => { return $http.get(modelsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.getProducts = () => { return $http.get(productsUrl + 'kvp', <any>{ headers: { 'No-Loading': true } }); };

            $scope.save = () => {
                (<any>$scope.shipping).$save().then((result: any) => {
                    notification.showNotify('Spedizione ' + $scope.shipping.date, 'Salvataggio eseguito con successo!');
                    $window.history.back();
                });
            }

            $scope.filters = {
                isActive: ''
            };

            $scope.addProduct = () => {
                $scope.filters = null;
                if ($scope.shipping && $scope.shipping.products == null)
                    $scope.shipping.products = [];

                $scope.shipping.products.push(<dto.IGenericObject>{ isActive: true });
            }

            $scope.removeProduct = (item: dto.IGenericObject) => {
                notification.showConfirm('Sei sicuro di voler eliminare la spedizione?').then((success: boolean) => {
                    if (success) {
                        var index = $scope.shipping.products.indexOf(item);
                        $scope.shipping.products.splice(index, 1);
                    }
                });
            }
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
        })
        .controller('changeLogCtrl', ($scope: any, $http: angular.IHttpService) => {

            $http.get('/content/changelog.json', { cache: false }).success((result: any[]) => {
                $scope.items = result;
            });
        })
        ;




}
