
 
 
 

 

/// <reference path="Enums.ts" />

declare module dto {
	interface IAbsenteeism {
		departmentId: number;
		departmentName: string;
		percentage: number;
		employeesAbsenteeism: dto.IEmployeeAbsenteeism[];
	}
	interface IEmployeeAbsenteeism {
		id: number;
		name: string;
		percentage: number;
	}
	interface IAbsenteeismList {
		departmentName: string;
		employeeName: string;
		percentage: number;
	}
	interface IOperatorAbsenteeism {
		campaignId: number;
		campaignName: string;
		percentage: number;
		teamLeadersAbsenteeism: dto.ITeamLeaderAbsenteeism[];
	}
	interface ITeamLeaderAbsenteeism {
		id: number;
		name: string;
		percentage: number;
		employeesAbsenteeism: dto.IEmployeeAbsenteeism[];
	}
	interface IOperatorAbsenteeismList {
		campaignName: string;
		teamLeaderName: string;
		employeeName: string;
		percentage: number;
	}
	interface IAttachment {
		id: number;
		name: string;
		content: number[];
		contentType: string;
		contentLength: number;
		typeId: number;
	}
	interface ICampaignList {
		id: number;
		name: string;
		code: string;
		startDate: Date;
		endDate: Date;
		isActive: boolean;
	}
	interface ICampaign {
		id: number;
		name: string;
		code: string;
		description: string;
		startDate: Date;
		endDate: Date;
		isActive: boolean;
		note: string;
	}
	interface ICampaignAssociation {
		id: number;
		campaign: dto.IKeyValuePair;
		teamLeader: dto.IKeyValuePair;
		noTeamLeader: boolean;
		code: string;
		startDate: Date;
		endDate: Date;
		isActive: boolean;
		note: string;
		presencesCount: number;
		absencesCount: number;
	}
	interface IKeyValuePair {
		key: string;
		value: number;
	}
	interface ICatalog {
		companyId: number;
		id: number;
		catalogType: string;
		code: string;
		name: string;
		description: string;
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
	interface IAnalysis {
		analysisPercentage: dto.IAnalysisPercentage[];
		analysisAverage: dto.IAnalysisAverage[];
	}
	interface IAnalysisPercentage extends dto.IAnalysisResult {
		value: number;
		total: number;
		percentage: number;
		percentageDescription: string;
	}
	interface IAnalysisResult {
		title: string;
		description: string;
		type: dto.ReportTypeDto;
	}
	interface IAnalysisAverage extends dto.IAnalysisResult {
		min: number;
		max: number;
		average: number;
	}
	interface ICompany {
		id: number;
		name: string;
		piva: string;
		fiscalCode: string;
		lineAddress: string;
		streetNumber: string;
		postalCode: string;
		countryId: number;
		countryName: string;
		provinceId: number;
		provinceName: string;
		municipalityId: number;
		municipalityName: string;
		telephone: string;
		mobile: string;
		fax: string;
		email: string;
		http: string;
		contactName: string;
		contactSurname: string;
		isEnabled: boolean;
		note: string;
		currency: dto.CurrencyDto;
		modulesIds: number[];
		departments: dto.IDepartment[];
		campaigns: dto.IKeyValuePair[];
		workPlaces: dto.IWorkPlace[];
	}
	interface IDepartment {
		id: number;
		name: string;
		description: string;
		isEnabled: boolean;
		isReadonly: boolean;
		type: dto.DepartmentTypeDto;
	}
	interface IWorkPlace {
		id: number;
		name: string;
		description: string;
	}
	interface IModule {
		id: number;
		name: string;
	}
	interface ICompanyList {
		id: number;
		name: string;
		piva: string;
		lineAddress: string;
		streetNumber: string;
		postalCode: string;
		municipalityName: string;
		province: string;
		isEnabled: boolean;
    }

    interface IBrandList {
        id: number;
        name: string;
        code: string;
        isActive: boolean;
    }

    interface ICampaignTypologyList {
        id: number;
        name: string;
        isEnabled: boolean;
    }
    interface IBrand {
        id: number;
        name: string;
        code: string;
        description: string;
        isActive: boolean;
        note: string;
    }

    interface ICampaignTypology {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        note: string;
    }
	interface IConfiguration {
		id: number;
		timeZoneOffset: number;
		currentDateTime: Date;
	}
	interface IContractList {
		id: number;
		employeeId: number;
		internalCode: string;
		employeeName: string;
		companyId: number;
		companyName: string;
		startDate: Date;
		endDate: Date;
		isActive: boolean;
	}
	interface IContract {
		id: number;
		employeeId: number;
		employeeName: string;
		internalCode: string;
		companyId: number;
		companyName: string;
		wage: number;
		startDate: Date;
		endDate: Date;
		attachments: dto.IAttachment[];
		type: dto.IKeyValuePair;
		closingType: dto.IKeyValuePair;
		note: string;
	}
	interface IJobHours {
		employee: string;
		campaign: string;
		department: string;
		hours: number;
	}
	interface IEmployeeJobHours {
		employee: string;
		hours: number;
	}
	interface IEmployeeRegistrationReport {
		date: Date;
		employee: string;
		campaign: string;
		entranceTime: Date;
		exitTime: Date;
		isAbsent: boolean;
		absenceType: string;
		absenceMotivation: string;
		hours: number;
	}
	interface IJobHoursList {
		departmentId: number;
		departmentName: string;
		employeeName: string;
		employeeHours: number;
	}
	interface IOperatorJobHours {
		campaignId: number;
		campaignName: string;
		hours: number;
		teamLeadersJobHours: dto.ITeamLeaderJobHours[];
	}
	interface ITeamLeaderJobHours {
		id: number;
		name: string;
		campaignId: number;
		campaignName: string;
		hours: number;
		employeesJobHours: dto.IEmployeeJobHours[];
	}
	interface IOperatorJobHoursList {
		campaignName: string;
		teamLeaderName: string;
		employeeName: string;
		employeeHours: number;
	}
	interface IEmployeeRegistration {
		date: Date;
		employee: dto.IKeyValuePair;
		campaignsAssociations: dto.ICampaignAssociationRegistration[];
		workPlaceDefault: dto.IKeyValuePair;
	}
	interface ICampaignAssociationRegistration {
		campaignAssociationId: number;
		campaign: dto.IKeyValuePair;
		teamLeader: dto.IKeyValuePair;
		details: dto.IRegistrationDetail[];
	}
	interface IRegistrationDetail {
		enterTime: Date;
		exitTime: Date;
		isAbsence: boolean;
		absenceMotivation: string;
		absenceType: dto.IKeyValuePair;
		workPlace: dto.IKeyValuePair;
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
	interface IEmployee {
		id: number;
		name: string;
		surname: string;
		gender: dto.GenderDto;
		birthPlaceId: number;
		birthPlaceName: string;
		birthProvinceId: number;
		birthProvinceName: string;
		birthCountryId: number;
		birthCountryName: string;
		birthDate: Date;
		fiscalCode: string;
		lineAddress: string;
		streetNumber: string;
		postalCode: string;
		provinceId: number;
		provinceName: string;
		municipalityName: string;
		municipalityId: number;
		countryId: number;
		countryName: string;
		telephone: string;
		mobile: string;
		fax: string;
		email: string;
		http: string;
		documentType: dto.IKeyValuePair;
		documentNumber: string;
		internalCode: string;
		note: string;
		employeeType: dto.EmployeeTypeDto;
		department: dto.IKeyValuePair;
		companyId: number;
		companyName: string;
		personInCharge: dto.IKeyValuePair;
		campaignAssociations: dto.ICampaignAssociation[];
		workPlace: dto.IKeyValuePair;
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
	interface IEmployeesPaginationRequest extends dto.IPaginationRequest {
		companyId: number;
		departmentId: number;
		isEnabled: boolean;
		term: string;
	}
	interface IEmployeePresencesPaginationRequest extends dto.IPaginationRequest {
		startDate: Date;
		endDate: Date;
		campaignId: number;
		employeeId: number;
	}
	interface ICompanyPresencesPaginationRequest extends dto.IPaginationRequest {
		startDate: Date;
		endDate: Date;
		campaignId: number;
		companyId: number;
		departmentId: number;
	}
	interface IContractsPaginationRequest extends dto.IPaginationRequest {
		companyId: number;
		employeeId: number;
		isActive: boolean;
		term: string;
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
		userName: string;
		eMail: string;
		name: string;
		surname: string;
		note: string;
		passwordDay: number;
		role: dto.UserRole;
		roleName: string;
		isDisable: boolean;
		allowViewChildStrip: boolean;
		isOnline: boolean;
		lastAccessDate: Date;
		lastActivityDate: Date;
		lastChangePasswordDate: Date;
		createUser: string;
		modifiedUser: string;
		lastUsedCompanyId: number;
		lastUsedCompanyName: string;
        companiesRights: dto.IUserCompanyRight[];
        campaignsRights: dto.IUserCampaignRight[];
		fullName: string;
	}
	interface IUserCompanyRight {
		companyId: number;
		companyName: string;
    }
    interface IUserCampaignRight {
        campaignId: number;
        campaignName: string;
    }
	interface IUserToken extends dto.IUser {
		companyIsCallCenter: boolean;
	}
	interface IUserList {
		id: number;
		name: string;
		surname: string;
		userName: string;
		eMail: string;
		role: dto.UserRole;
		isDisable: boolean;
		lastAccessDate: Date;
		isOnline: boolean;
		roleName: string;
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
		accessToken: string;
		tokenType: string;
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


