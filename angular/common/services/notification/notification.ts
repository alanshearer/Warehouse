module Notification {

    export enum NotificationType {
        Error,
        Warning,
        Alert,
        Information,
        Success,
        Confirm,
    }

    export interface INotificationService {
        handleException(error: WebApi.Resources.IException): void;
        showError(errorMessage: string): void;
        showConfirm(question: string): angular.IPromise<boolean>;
        showConfirm(question: string, yesLabel: string): angular.IPromise<boolean>;
        showConfirm(question: string, yesLabel: string, cancelLabel: string): angular.IPromise<boolean>;
        showSuccess(message: string): angular.IPromise<boolean>;
        showSuccess(title: string, message: string): angular.IPromise<boolean>;
        showWarning(message: string): void;
        showNotify(title: string, text: string): void;
        showInformation(message: string): void;
    }


    angular.module("notification", [])

        .service("notification", function ($window: angular.IWindowService, $log: angular.ILogService, $q: angular.IQService) {

            this.showSuccess = (title: string, message: string = null) => {

                var deffered = $q.defer();
                (<any>$).jAlert({
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

            this.showWarning = (message: string) => {
                notyfyForSimpleMessage(message, NotificationType.Warning);
            };

            this.showError = (errorMessage: string) => {
                notyfyForSimpleMessage(errorMessage, NotificationType.Error);
            };

            this.showInformation= (message: string) => {
                notyfyForSimpleMessage(message, NotificationType.Information);
            };

            function arrayBuffer2String(buf, callback) {
                var bb = new Blob([buf]);
                var f = new FileReader();
                f.onload = e => {
                    callback((<any>e.target).result);
                }
                f.readAsText(bb);
            }

            this.handleException = (errorObj: any) => {
                var notificationType: NotificationType = NotificationType.Alert;

                if (!angular.isObject(errorObj)) {
                    return;
                }

                if (errorObj == null) {
                    $log.error('Attenzione il parametro error non può essere null');
                    return;
                }

                var deffer = $q.defer();

                var bufferArray = <any>errorObj;
                if (bufferArray.byteLength > 0) {
                    arrayBuffer2String(bufferArray,
                        result => {
                            deffer.resolve(JSON.parse(result));
                        }
                    );
                } else {
                    deffer.resolve(errorObj);
                }

                deffer.promise.then((error: WebApi.Resources.IException) => {

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

            this.showNotify = (title: string, text: string) => {

                (<any>$).notific8(text, {
                    sticky: false,
                    horizontalEdge: "top",
                    theme: "inverse",
                    heading: title
                });
            };

            this.showConfirm = (question: string, yesLabel: string = null, cancelLabel: string = null): angular.IPromise<boolean> => {

                var deffered = $q.defer();

                (<any>$).jAlert({
                    'title': 'Conferma',
                    'confirmQuestion': question,
                    'theme': 'blue',
                    'size': 'lg',
                    'type': 'confirm',
                    'showAnimation': 'flipInX',
                    'hideAnimation': 'flipOutX',
                    'confirmBtnText': yesLabel || 'Si',
                    'denyBtnText': cancelLabel || 'No',
                    'onConfirm': (e, btn) => {
                        deffered.resolve(true);
                    },
                    'onDeny': (e, btn) => {
                        deffered.resolve(false);
                    }
                });
                return deffered.promise;
            };

            function notyfyForSimpleMessage(message: string, notificationType: NotificationType, wait: boolean = true) {

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

                (<any>$).jAlert({
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

}