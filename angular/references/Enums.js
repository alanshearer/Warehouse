var dto;
(function (dto) {
    (function (AbsenteeismReportTypeDto) {
        AbsenteeismReportTypeDto[AbsenteeismReportTypeDto["Campagna"] = 1] = "Campagna";
        AbsenteeismReportTypeDto[AbsenteeismReportTypeDto["Reparto"] = 2] = "Reparto";
        AbsenteeismReportTypeDto[AbsenteeismReportTypeDto["TeamLeader"] = 3] = "TeamLeader";
        AbsenteeismReportTypeDto[AbsenteeismReportTypeDto["CampagnaeTeamLeader"] = 4] = "CampagnaeTeamLeader";
        AbsenteeismReportTypeDto[AbsenteeismReportTypeDto["Individuale"] = 5] = "Individuale";
    })(dto.AbsenteeismReportTypeDto || (dto.AbsenteeismReportTypeDto = {}));
    var AbsenteeismReportTypeDto = dto.AbsenteeismReportTypeDto;
    (function (TurnoverReportTypeDto) {
        TurnoverReportTypeDto[TurnoverReportTypeDto["Campagna"] = 1] = "Campagna";
        TurnoverReportTypeDto[TurnoverReportTypeDto["Reparto"] = 2] = "Reparto";
    })(dto.TurnoverReportTypeDto || (dto.TurnoverReportTypeDto = {}));
    var TurnoverReportTypeDto = dto.TurnoverReportTypeDto;
    (function (ReportFormatTypeDto) {
        ReportFormatTypeDto[ReportFormatTypeDto["Excel"] = 1] = "Excel";
        ReportFormatTypeDto[ReportFormatTypeDto["Pdf"] = 2] = "Pdf";
    })(dto.ReportFormatTypeDto || (dto.ReportFormatTypeDto = {}));
    var ReportFormatTypeDto = dto.ReportFormatTypeDto;
    (function (ReportTypeDto) {
        ReportTypeDto[ReportTypeDto["JobHours"] = 1] = "JobHours";
        ReportTypeDto[ReportTypeDto["OperatorHours"] = 2] = "OperatorHours";
        ReportTypeDto[ReportTypeDto["TeamLeaderJobHours"] = 3] = "TeamLeaderJobHours";
        ReportTypeDto[ReportTypeDto["Absenteism"] = 4] = "Absenteism";
        ReportTypeDto[ReportTypeDto["OperatorAbsenteism"] = 5] = "OperatorAbsenteism";
    })(dto.ReportTypeDto || (dto.ReportTypeDto = {}));
    var ReportTypeDto = dto.ReportTypeDto;
    (function (DepartmentTypeDto) {
        DepartmentTypeDto[DepartmentTypeDto["Generic"] = 1] = "Generic";
        DepartmentTypeDto[DepartmentTypeDto["Operator"] = 2] = "Operator";
        DepartmentTypeDto[DepartmentTypeDto["TeamLeader"] = 3] = "TeamLeader";
        DepartmentTypeDto[DepartmentTypeDto["FloorManager"] = 4] = "FloorManager";
        DepartmentTypeDto[DepartmentTypeDto["CoachTeamLeader"] = 5] = "CoachTeamLeader";
    })(dto.DepartmentTypeDto || (dto.DepartmentTypeDto = {}));
    var DepartmentTypeDto = dto.DepartmentTypeDto;
    (function (CurrencyDto) {
        CurrencyDto[CurrencyDto["Euro"] = 1] = "Euro";
        CurrencyDto[CurrencyDto["Lek"] = 2] = "Lek";
    })(dto.CurrencyDto || (dto.CurrencyDto = {}));
    var CurrencyDto = dto.CurrencyDto;
    (function (WageTypeDto) {
        WageTypeDto[WageTypeDto["Hourly"] = 1] = "Hourly";
        WageTypeDto[WageTypeDto["Montly"] = 2] = "Montly";
        WageTypeDto[WageTypeDto["Fixed"] = 3] = "Fixed";
        WageTypeDto[WageTypeDto["Other"] = 100] = "Other";
    })(dto.WageTypeDto || (dto.WageTypeDto = {}));
    var WageTypeDto = dto.WageTypeDto;
    (function (RegistrationTypeFilterDto) {
        RegistrationTypeFilterDto[RegistrationTypeFilterDto["NotCompleted"] = 1] = "NotCompleted";
        RegistrationTypeFilterDto[RegistrationTypeFilterDto["Completed"] = 2] = "Completed";
        RegistrationTypeFilterDto[RegistrationTypeFilterDto["EntranceWithoutExit"] = 3] = "EntranceWithoutExit";
        RegistrationTypeFilterDto[RegistrationTypeFilterDto["Absence"] = 4] = "Absence";
        RegistrationTypeFilterDto[RegistrationTypeFilterDto["Missing"] = 5] = "Missing";
    })(dto.RegistrationTypeFilterDto || (dto.RegistrationTypeFilterDto = {}));
    var RegistrationTypeFilterDto = dto.RegistrationTypeFilterDto;
    (function (GenderDto) {
        GenderDto[GenderDto["M"] = 1] = "M";
        GenderDto[GenderDto["F"] = 2] = "F";
    })(dto.GenderDto || (dto.GenderDto = {}));
    var GenderDto = dto.GenderDto;
    (function (EmployeeTypeDto) {
        EmployeeTypeDto[EmployeeTypeDto["Generic"] = 1] = "Generic";
        EmployeeTypeDto[EmployeeTypeDto["Operator"] = 2] = "Operator";
    })(dto.EmployeeTypeDto || (dto.EmployeeTypeDto = {}));
    var EmployeeTypeDto = dto.EmployeeTypeDto;
    (function (UserRole) {
        UserRole[UserRole["SysAdmin"] = 1] = "SysAdmin";
        UserRole[UserRole["Supervisor"] = 2] = "Supervisor";
        UserRole[UserRole["Backoffice"] = 3] = "Backoffice";
        UserRole[UserRole["Management"] = 4] = "Management";
        UserRole[UserRole["DataEntry"] = 5] = "DataEntry";
        UserRole[UserRole["HrSpecialist"] = 6] = "HrSpecialist";
        UserRole[UserRole["HrManager"] = 7] = "HrManager";
        UserRole[UserRole["FloorManager"] = 8] = "FloorManager";
    })(dto.UserRole || (dto.UserRole = {}));
    var UserRole = dto.UserRole;
    (function (ValidationExceptionCode) {
        ValidationExceptionCode[ValidationExceptionCode["RecordNotFound"] = 1] = "RecordNotFound";
        ValidationExceptionCode[ValidationExceptionCode["PasswordExpired"] = 2] = "PasswordExpired";
        ValidationExceptionCode[ValidationExceptionCode["FieldValidationFailed"] = 3] = "FieldValidationFailed";
        ValidationExceptionCode[ValidationExceptionCode["RecordAlreadyExists"] = 4] = "RecordAlreadyExists";
        ValidationExceptionCode[ValidationExceptionCode["RecordCannotBeDeleted"] = 5] = "RecordCannotBeDeleted";
        ValidationExceptionCode[ValidationExceptionCode["RecordIsDisable"] = 6] = "RecordIsDisable";
        ValidationExceptionCode[ValidationExceptionCode["InvalidConfigurationParameters"] = 7] = "InvalidConfigurationParameters";
        ValidationExceptionCode[ValidationExceptionCode["RecordIsUsed"] = 8] = "RecordIsUsed";
        ValidationExceptionCode[ValidationExceptionCode["NotAllowed"] = 9] = "NotAllowed";
    })(dto.ValidationExceptionCode || (dto.ValidationExceptionCode = {}));
    var ValidationExceptionCode = dto.ValidationExceptionCode;
})(dto || (dto = {}));
var System;
(function (System) {
    var Net;
    (function (Net) {
        (function (HttpStatusCode) {
            HttpStatusCode[HttpStatusCode["Continue"] = 100] = "Continue";
            HttpStatusCode[HttpStatusCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
            HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
            HttpStatusCode[HttpStatusCode["Created"] = 201] = "Created";
            HttpStatusCode[HttpStatusCode["Accepted"] = 202] = "Accepted";
            HttpStatusCode[HttpStatusCode["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
            HttpStatusCode[HttpStatusCode["NoContent"] = 204] = "NoContent";
            HttpStatusCode[HttpStatusCode["ResetContent"] = 205] = "ResetContent";
            HttpStatusCode[HttpStatusCode["PartialContent"] = 206] = "PartialContent";
            HttpStatusCode[HttpStatusCode["MultipleChoices"] = 300] = "MultipleChoices";
            HttpStatusCode[HttpStatusCode["Ambiguous"] = 300] = "Ambiguous";
            HttpStatusCode[HttpStatusCode["MovedPermanently"] = 301] = "MovedPermanently";
            HttpStatusCode[HttpStatusCode["Moved"] = 301] = "Moved";
            HttpStatusCode[HttpStatusCode["Found"] = 302] = "Found";
            HttpStatusCode[HttpStatusCode["Redirect"] = 302] = "Redirect";
            HttpStatusCode[HttpStatusCode["SeeOther"] = 303] = "SeeOther";
            HttpStatusCode[HttpStatusCode["RedirectMethod"] = 303] = "RedirectMethod";
            HttpStatusCode[HttpStatusCode["NotModified"] = 304] = "NotModified";
            HttpStatusCode[HttpStatusCode["UseProxy"] = 305] = "UseProxy";
            HttpStatusCode[HttpStatusCode["Unused"] = 306] = "Unused";
            HttpStatusCode[HttpStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
            HttpStatusCode[HttpStatusCode["RedirectKeepVerb"] = 307] = "RedirectKeepVerb";
            HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
            HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
            HttpStatusCode[HttpStatusCode["PaymentRequired"] = 402] = "PaymentRequired";
            HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
            HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
            HttpStatusCode[HttpStatusCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
            HttpStatusCode[HttpStatusCode["NotAcceptable"] = 406] = "NotAcceptable";
            HttpStatusCode[HttpStatusCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
            HttpStatusCode[HttpStatusCode["RequestTimeout"] = 408] = "RequestTimeout";
            HttpStatusCode[HttpStatusCode["Conflict"] = 409] = "Conflict";
            HttpStatusCode[HttpStatusCode["Gone"] = 410] = "Gone";
            HttpStatusCode[HttpStatusCode["LengthRequired"] = 411] = "LengthRequired";
            HttpStatusCode[HttpStatusCode["PreconditionFailed"] = 412] = "PreconditionFailed";
            HttpStatusCode[HttpStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
            HttpStatusCode[HttpStatusCode["RequestUriTooLong"] = 414] = "RequestUriTooLong";
            HttpStatusCode[HttpStatusCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
            HttpStatusCode[HttpStatusCode["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
            HttpStatusCode[HttpStatusCode["ExpectationFailed"] = 417] = "ExpectationFailed";
            HttpStatusCode[HttpStatusCode["UpgradeRequired"] = 426] = "UpgradeRequired";
            HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
            HttpStatusCode[HttpStatusCode["NotImplemented"] = 501] = "NotImplemented";
            HttpStatusCode[HttpStatusCode["BadGateway"] = 502] = "BadGateway";
            HttpStatusCode[HttpStatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
            HttpStatusCode[HttpStatusCode["GatewayTimeout"] = 504] = "GatewayTimeout";
            HttpStatusCode[HttpStatusCode["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
        })(Net.HttpStatusCode || (Net.HttpStatusCode = {}));
        var HttpStatusCode = Net.HttpStatusCode;
    })(Net = System.Net || (System.Net = {}));
})(System || (System = {}));
//# sourceMappingURL=Enums.js.map