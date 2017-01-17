






/// <reference path="Enums.ts" />

declare module dto {
    interface IGenericObject { }
    interface IKeyValuePair {
        key: string;
        value: number;
    }
    interface IChangeCompanyRequest {
        companyId: number;
    }
    interface IChangePasswordParameters {
        oldPassword: string;
        newPassword: string;
        userName: string;
    }
    interface IChart {
        header: string;
        description: string;
        series: dto.IChartSeries[];
    }
    interface IChartSeries {
        name: string;
        values: dto.IAxisDateValues[];
    }
    interface IAxisDateValues {
        x: string;
        y: number;
    }
    interface IModule {
        id: number;
        name: string;
    }

    interface IBrandList {
        id: number;
        name: string;
        code: string;
        isActive: boolean;
    }

    interface IBrand {
        id: number;
        name: string;
        code: string;
        description: string;
        isActive: boolean;
        note: string;
    }

    interface IConfiguration {
        id: number;
        timeZoneOffset: number;
        currentDateTime: Date;
    }

    interface IMunicipality {
        istat: string;
        name: string;
        postalCode: string;
    }
    interface IEmployeeList {
        id: number;
        name: string;
        surname: string;
        internalCode: string;
        departmentId: number;
        departmentName: string;
    }
    interface IPaginationRequest {
        pageIndex: number;
        pageSize: number;
        sortBy: string;
        sortByAscending: boolean;
        xmlConditions: string;
        moreInfo: boolean;
    }
    interface IXlsRequest {
        sortBy: string;
        sortByAscending: boolean;
    }
    interface IUsersPaginationRequest extends dto.IPaginationRequest {
        isEnabled: boolean;
        term: string;
    }
    interface ICompaniesPaginationRequest extends dto.IPaginationRequest {
        name: string;
        isEnabled: boolean;
    }
    interface ICampaignsPaginationRequest extends dto.IPaginationRequest {
        isActive: boolean;
    }
    interface IProvince {
        id: number;
        name: string;
        region: string;
    }
    interface IResetPasswordParameters {
        userName: string;
        email: string;
    }
    interface IUser {
        id: number;
        username: string;
        email: string;
        firstname: string;
        lastname: string;
        lastAccessDate: Date;
        role: dto.UserRole;
        rolename: string;
        isDisable: boolean;
        allowViewChildStrip: boolean;
        isOnline: boolean;
        lastChangePasswordDate: Date;
        createUser: string;
        modifiedUser: string;
        lastUsedCompanyId: number;
        lastUsedCompanyName: string;
        officesRights: dto.IUserOfficeRight[];
        fullName: string;
    }
    interface IUserOfficeRight {
        officeId: number;
        officeName: string;
    }
    interface IUserToken extends dto.IUser {
        companyIsCallCenter: boolean;
    }
    interface IUserList {
        id: number;
        username: string;
        email: string;
        fisrtname: string;
        lastname: string;
        role: dto.UserRole;
        isDisable: boolean;
        lastAccessDate: Date;
        isOnline: boolean;
        rolename: string;
    }
    interface IUserPermission {
        states: dto.IUserPermissionState[];
        runners: dto.IKeyValuePair[];
        operators: dto.IKeyValuePair[];
    }
    interface IUserPermissionState {
        id: number;
        name: string;
        code: string;
        columns: string;
    }
    interface IUserTokenResponse {
        identity: dto.IUserToken;
        accesstoken: string;
        tokentype: string;
    }
    interface IValidateUserParameters {
        userName: string;
        password: string;
    }
}
declare module WebApi.Resources {
    interface IException {
        statusCode: System.Net.HttpStatusCode;
        message: string;
        validationErrors: string[];
        badRequestType: dto.ValidationExceptionCode;
    }
}


