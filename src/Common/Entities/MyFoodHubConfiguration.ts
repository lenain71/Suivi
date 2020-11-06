export default class MyFoodHubConfiguration {
    public Id: number;
    public startDate: Date;
    public locationLatitude: number;
    public locationLongitude: number;
    public version: string;
    public info: string;
    public lastMeasureReceived: Date;
    public productionUnitType: string;
    public hydroponicType: string;
    public productionUnitStatus: string;
    public pionnerCitizenOffice365Account: string;
    public pioneerCitizen: string;
    public pioneerCitizenNumber: string;
    public picturePath: string;
    public options: Options[];
}

class Options {
    public Id: number;
    public name: string;
    public description: string;
}