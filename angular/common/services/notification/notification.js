var Notification;
(function (Notification) {
    (function (NotificationType) {
        NotificationType[NotificationType["Error"] = 0] = "Error";
        NotificationType[NotificationType["Warning"] = 1] = "Warning";
        NotificationType[NotificationType["Alert"] = 2] = "Alert";
        NotificationType[NotificationType["Information"] = 3] = "Information";
        NotificationType[NotificationType["Success"] = 4] = "Success";
        NotificationType[NotificationType["Confirm"] = 5] = "Confirm";
    })(Notification.NotificationType || (Notification.NotificationType = {}));
    var NotificationType = Notification.NotificationType;
    angular.module("notification", [])
        .service("notification", function ($window, $log, $q) {
        this.showSuccess = function (title, message) {
            if (message === void 0) { message = null; }
            var deffered = $q.defer();
            $.jAlert({
                'title': title || "Messaggio",
                'content': message,
                'theme': 'green',
                'size': 'lg',
                'showAnimation': 'flipInX',
                'hideAnimation': 'flipOutX',
                'btns': [{ 'text': 'ok', 'onClick': function () { deffered.resolve(true); } }]
            });
            return deffered.promise;
        };
        this.showWarning = function (message) {
            notyfyForSimpleMessage(message, NotificationType.Warning);
        };
        this.showError = function (errorMessage) {
            notyfyForSimpleMessage(errorMessage, NotificationType.Error);
        };
        this.showInformation = function (message) {
            notyfyForSimpleMessage(message, NotificationType.Information);
        };
        function arrayBuffer2String(buf, callback) {
            var bb = new Blob([buf]);
            var f = new FileReader();
            f.onload = function (e) {
                callback(e.target.result);
            };
            f.readAsText(bb);
        }
        this.handleException = function (errorObj) {
            var notificationType = NotificationType.Alert;
            if (!angular.isObject(errorObj)) {
                return;
            }
            if (errorObj == null) {
                $log.error('Attenzione il parametro error non può essere null');
                return;
            }
            var deffer = $q.defer();
            var bufferArray = errorObj;
            if (bufferArray.byteLength > 0) {
                arrayBuffer2String(bufferArray, function (result) {
                    deffer.resolve(JSON.parse(result));
                });
            }
            else {
                deffer.resolve(errorObj);
            }
            deffer.promise.then(function (error) {
                if (angular.isUndefined(error.statusCode) || angular.isUndefined(error.message)) {
                    $log.error('Attenzione il parametro error deve essere un oggetto contenente le seguenti informazioni: statusCode, message');
                    return;
                }
                switch (error.statusCode) {
                    case 500:
                        notificationType = NotificationType.Error;
                        break;
                    case 404:
                    case 400:
                        notificationType = NotificationType.Warning;
                        break;
                    case 405:
                        notificationType = NotificationType.Error;
                        break;
                }
                notyfyForSimpleMessage(error.message, notificationType);
            });
        };
        this.showNotify = function (title, text) {
            $.notific8(text, {
                sticky: false,
                horizontalEdge: "top",
                theme: "inverse",
                heading: title
            });
        };
        this.showConfirm = function (question, yesLabel, cancelLabel) {
            if (yesLabel === void 0) { yesLabel = null; }
            if (cancelLabel === void 0) { cancelLabel = null; }
            var deffered = $q.defer();
            $.jAlert({
                'title': 'Conferma',
                'confirmQuestion': question,
                'theme': 'blue',
                'size': 'lg',
                'type': 'confirm',
                'showAnimation': 'flipInX',
                'hideAnimation': 'flipOutX',
                'confirmBtnText': yesLabel || 'Si',
                'denyBtnText': cancelLabel || 'No',
                'onConfirm': function (e, btn) {
                    deffered.resolve(true);
                },
                'onDeny': function (e, btn) {
                    deffered.resolve(false);
                }
            });
            return deffered.promise;
        };
        function notyfyForSimpleMessage(message, notificationType, wait) {
            if (wait === void 0) { wait = true; }
            if (message == '') {
                $log.error('Attenzione il parametro message non può essere nullo o vuoto.');
                return;
            }
            var theme = 'default';
            var title = 'Messaggio';
            switch (notificationType) {
                case NotificationType.Warning:
                    title = '<i class="fa fa-warning"></i>&nbsp;Avviso';
                    theme = 'yellow';
                    break;
                case NotificationType.Alert:
                    title = '<i class="fa fa-warning"></i>&nbsp;Avviso';
                    theme = 'brown';
                    break;
                case NotificationType.Confirm:
                    title = '<i class="fa fa-question"></i>&nbsp;Conferma';
                    theme = 'brown';
                    break;
                case NotificationType.Error:
                    title = '<i class="fa fa-ban"></i>&nbsp;Errore';
                    theme = 'red';
                    break;
                case NotificationType.Success:
                    title = '<i class="fa fa-check"></i>&nbsp;Messaggio';
                    theme = 'green';
                    break;
                case NotificationType.Information:
                    title = '<i class="fa fa-info"></i>&nbsp;Informazione';
                    theme = 'blue';
                    break;
                default:
            }
            $.jAlert({
                'title': title,
                'content': message,
                'theme': theme,
                'size': 'lg',
                'showAnimation': 'flipInX',
                'hideAnimation': 'flipOutX',
                'btns': { 'text': 'chiudi' }
            });
            //(<any>$window).noty({
            //    text: message,
            //    type: NotificationType[notificationType].toString().toLowerCase(),
            //    layout: 'top',
            //    modal: wait,
            //    theme: 'customTheme',
            //    closeWith: ['click']
            //});
        }
    });
})(Notification || (Notification = {}));
//# sourceMappingURL=notification.js.map