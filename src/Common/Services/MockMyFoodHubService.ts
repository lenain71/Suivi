import { IMyFoodHubService } from "../Contracts/IMyFoodHubService";
import MyFoodHubConfiguration from "../Entities/MyFoodHubConfiguration";

export default class MockMyFoodHubService implements IMyFoodHubService
{
    public getInformationFromHub(username: string): Promise<Array<MyFoodHubConfiguration>> {
        let result = new Array<MyFoodHubConfiguration>();

        result.push({
            Id: 0,
            startDate: new Date(),
            locationLatitude: 12.2,
            locationLongitude: 12.2,
            version : "1.1",
            info: "info",
            lastMeasureReceived: new Date(),
            productionUnitType: "Aquaponique 13 tours",
            hydroponicType : "Aqua v2",
            productionUnitStatus: "Production",
            pionnerCitizenOffice365Account: "charly.delarche@googlemail.com",
            pioneerCitizen : "Charly D",
            pioneerCitizenNumber: "244",
            picturePath: null,
            options: []
        });

        return Promise.resolve(result);
    }
    
}