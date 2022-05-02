import { IMyFoodHubService } from "../Contracts/IMyFoodHubService";
import MyFoodHubConfiguration from "../Entities/MyFoodHubConfiguration";

export default class MockMyFoodHubService implements IMyFoodHubService
{
    public getInformationFromHub(username: string): Promise<Array<MyFoodHubConfiguration>> {
        let result = new Array<MyFoodHubConfiguration>();

        result.push({
            productionUnitStartDate: new Date(),
            location: 'DIJON',
            productionUnitInfo:  "info",
            onlineSinceWeeks: 12,
            productionUnitTypeName:  "Aquaponique 13 tours",
            productionUnitOptions: "",
            productionUnitTypeImage: null,
            productionUnitStatus: "Production",
            pionnerCitizenOffice365Account: "charly.delarche@googlemail.com",
            pioneerCitizenName : "Charly D",
            pioneerCitizenNumber: "244",
            picturePath: null
        });

        return Promise.resolve(result);
    }
    
}