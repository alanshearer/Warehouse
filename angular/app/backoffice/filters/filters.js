var BackOfficeApp;
(function (BackOfficeApp) {
    var Filters;
    (function (Filters) {
        angular.module('backofficeApp.Filters', [])
            .filter('roleName', function () {
            return function (value) {
                switch (value) {
                    case dto.UserRole.SysAdmin:
                        return "Amministratore";
                    case dto.UserRole.Backoffice:
                        return "Backoffice";
                    case dto.UserRole.Management:
                        return "Management";
                    case dto.UserRole.Supervisor:
                        return "Supervisore";
                    case dto.UserRole.DataEntry:
                        return "Data entry";
                    case dto.UserRole.HrSpecialist:
                        return "HR Specialist";
                    case dto.UserRole.HrManager:
                        return "Hr Manager";
                    case dto.UserRole.FloorManager:
                        return "Floor manager";
                    default:
                        return "Sconosciuto";
                }
            };
        });
    })(Filters = BackOfficeApp.Filters || (BackOfficeApp.Filters = {}));
})(BackOfficeApp || (BackOfficeApp = {}));
//# sourceMappingURL=filters.js.map