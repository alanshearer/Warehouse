module BackOfficeApp.Filters {

    angular.module('backofficeApp.Filters', [])
        .filter('rolename', () => {
            return (value: dto.UserRole) => {
                switch (value) {
                    case dto.UserRole.Amministratore:
                        return "Amministratore";
                    case dto.UserRole.Respmagazzino:
                        return "RespMagazzino";
                    case dto.UserRole.Controllore:
                        return "Controllore";
                    case dto.UserRole.Respassistenza:
                        return "RespAssistenza";
                    default:
                        return "Sconosciuto";
                }
            };

        });
}