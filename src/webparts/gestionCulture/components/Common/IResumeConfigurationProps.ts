import { WebPartContext } from "@microsoft/sp-webpart-base";
import MyFoodHubConfiguration from "../../../../Common/Entities/MyFoodHubConfiguration";

export interface IResumeConfigurationProps {
    webpartContext: WebPartContext;
    dataContext: MyFoodHubConfiguration;
    myfoodhub_ImageUrl: string;
}