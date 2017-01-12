module BackOfficeApp.Filters {

    angular.module('backofficeApp.Filters', [])
        .filter('rolename', () => {
            return (value: dto.UserRole) => {
                switch (value) {
                    case dto.UserRole.Amministratore:
                        return "Amministratore";
                    case dto.UserRole.RespMagazzino:
                        return "Responsabile Magazzino";
                    case dto.UserRole.Controllore:
                        return "Controllore";
                    case dto.UserRole.RespAssistenza:
                        return "Responsabile Assistenza";
                    default:
                        return "Sconosciuto";
                }
            };

        });
}