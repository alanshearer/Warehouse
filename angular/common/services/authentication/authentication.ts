module Authentication {

    export interface IAuthenticationProvider extends angular.IServiceProvider {
        configuration: IConfiguration;
    }

    export interface IAuthenticationService<TUser extends IUser> {
        login(email: string, password: string): angular.IPromise<TUser>;
        resetPassword(username: string, email: string): angular.IPromise<boolean>;
        logout(): void;
        isAuthenticated: boolean;
        identity: TUser;
        fillAuthData(): void;
        renewalToken(token: IToken<IUser>): void
    }

    export interface IConfiguration {
        validateServiceUrl: string;
        resetPasswordServiceUrl: string
    }

    interface ICurrentUserViewModel extends angular.IScope {
        isAuthenticated: boolean;
        logout: () => void;
        identity: IUser;
    }

    export interface IToken<TIdentity> {
        accesstoken: string;
        tokentype: string;
        identity: TIdentity;
    }

    export interface IUser {
        firstname: string
        lastname: string
        email: string
        rolename: string
        lastAccessDate: Date
    }

    angular.module("authentication", [])
        .constant('templatePath', '/common/services/authentication/templates/')
        .provider("authentication", function () {

            var configuration: IConfiguration = {
                validateServiceUrl: '',
                resetPasswordServiceUrl: ''
            };

            return {
                configuration: configuration,
                $get: ($http: angular.IHttpService, $q: angular.IQService, $rootScope: angular.IRootScopeService, localStorageService: any) => {

                    var identity: IUser = { firstname: '', lastname: '', email: '', lastAccessDate: null, rolename: ''};

                    var isAuthenticated: boolean;

                    function setToken(token: IToken<IUser>) {
                        if (token == null) {
                            throw 'La request di autenticazione non può ritornare un valore null';
                        }

                        if (angular.isUndefined(token.identity) || angular.isUndefined(token.accesstoken || angular.isUndefined(token.tokentype))) {
                            throw 'La request non contiente le seguente proprietà obbligatorie: identity, accesstoken, tokentype';
                        }
                        localStorageService.set('userToken', token);

                        (<any>$http.defaults.headers.common).Authorization = token.tokentype + ' ' + token.accesstoken;


                        angular.copy(token.identity, identity);
                        isAuthenticated = true;
                    };

                    var userProvider: IAuthenticationService<IUser> = {
                        get identity() {
                            return identity;
                        },
                        get isAuthenticated() {
                            return isAuthenticated;
                        },
                        login(email: string, password: string): angular.IPromise<IUser> {
                            var deffered = $q.defer();
                            var data = { "email": email, "password": password };

                       
                            $http.post(configuration.validateServiceUrl, data)
                                .success((result: IToken<IUser>) => {
                                    setToken(result);
                                    deffered.resolve(result.identity);
                                })
                                .error((error: any) => {
                                    deffered.reject(error);
                                });
                            return deffered.promise;
                        },
                        renewalToken(token: IToken<IUser>) {
                            setToken(token);
                        },
                        resetPassword(username: string, email: string): angular.IPromise<boolean> {
                            var deffered = $q.defer();
                            var data = { "username": username, "email": email };

                            $http.post(configuration.resetPasswordServiceUrl, data)
                                .success(() => { deffered.resolve(true); })
                                .error((error: any) => { deffered.reject(error); });

                            return deffered.promise;
                        },
                        logout() {
                            if (this.isAuthenticated) {
                                (<any>$http.defaults.headers.common).Authorization = '';
                                identity = null;
                                isAuthenticated = false;
                                localStorageService.remove('userToken');
                            }
                        },
                        fillAuthData() {
                            var userToken = localStorageService.get('userToken');
                            if (userToken) 
                                setToken(userToken);
                        }
                    };

                    return userProvider;
                }
            }
        })
        .filter('hasRole', ($parse: angular.IParseService, authentication: IAuthenticationService<IUser>) => {

            function evalExpression(role: string) {
                return role == (authentication.isAuthenticated && authentication.identity.rolename);
            }

            return roleExpr => {
                // Replace all instances of " with '
                roleExpr = roleExpr.replace(/"/g, "'");
                if (roleExpr.indexOf("'") < 0) {
                    return evalExpression(roleExpr);
                }


                var newExpr = roleExpr.replace(/'(\w+)'/g, "evalExpression('$1')");
                return $parse(newExpr)({
                    evalExpression: evalExpression,
                });
            };
        });
}