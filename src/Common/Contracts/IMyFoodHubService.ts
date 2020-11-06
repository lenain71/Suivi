import MyFoodHubConfiguration from "../Entities/MyFoodHubConfiguration";

export interface IMyFoodHubService {
    getInformationFromHub(username: string) : Promise<Array<MyFoodHubConfiguration>>;
}