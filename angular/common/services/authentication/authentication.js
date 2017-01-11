var Authentication;
(function (Authentication) {
    angular.module("authentication", [])
        .constant('templatePath', '/common/services/authentication/templates/')
        .provider("authentication", function () {
        var configuration = {
            validateServiceUrl: '',
            resetPasswordServiceUrl: ''
        };
        return {
            configuration: configuration,
            $get: function ($http, $q, $rootScope, localStorageService) {
                var identity = { name: '', surname: '', lastAccessDate: null, rolename: null };
                var isAuthenticated;
                function setToken(token) {
                    if (token == null) {
                        throw 'La request di autenticazione non può ritornare un valore null';
                    }
                    if (angular.isUndefined(token.identity) || angular.isUndefined(token.accessToken || angular.isUndefined(token.tokenType))) {
                        throw 'La request non contiente le seguente proprietà obbligatorie: identity, accessToken, tokenType';
                    }
                    localStorageService.set('userToken', token);
                    $http.defaults.headers.common.Authorization = token.tokenType + ' ' + token.accessToken;
                    angular.copy(token.identity, identity);
                    isAuthenticated = true;
                }
                ;
                var userProvider = {
                    get identity() {
                        return identity;
                    },
                    get isAuthenticated() {
                        return isAuthenticated;
                    },
                    login: function (username, password) {
                        var deffered = $q.defer();
                        var data = { "username": username, "password": password };
                        $http.post(configuration.validateServiceUrl, data)
                            .success(function (result) {
                            setToken(result);
                            deffered.resolve(result.identity);
                        })
                            .error(function (error) {
                            deffered.reject(error);
                        });
                        return deffered.promise;
                    },
                    renewalToken: function (token) {
                        setToken(token);
                    },
                    resetPassword: function (username, email) {
                        var deffered = $q.defer();
                        var data = { "username": username, "email": email };
                        $http.post(configuration.resetPasswordServiceUrl, data)
                            .success(function () { deffered.resolve(true); })
                            .error(function (error) { deffered.reject(error); });
                        return deffered.promise;
                    },
                    logout: function () {
                        if (this.isAuthenticated) {
                            $http.defaults.headers.common.Authorization = '';
                            identity = null;
                            isAuthenticated = false;
                            localStorageService.remove('userToken');
                        }
                    },
                    fillAuthData: function () {
                        var userToken = localStorageService.get('userToken');
                        if (userToken)
                            setToken(userToken);
                    }
                };
                return userProvider;
            }
        };
    })
        .filter('hasRole', function ($parse, authentication) {
        function evalExpression(role) {
            return role == (authentication.isAuthenticated && authentication.identity.rolename);
        }
        return function (roleExpr) {
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
})(Authentication || (Authentication = {}));
//# sourceMappingURL=authentication.js.map