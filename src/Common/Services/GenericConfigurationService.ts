import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { IGenericConfigurationServices } from "../Contracts/IGenericConfigurationServices";
import GenericConfiguration from "../Entities/GenericConfiguration";
import MyFoodHubConfiguration from "../Entities/MyFoodHubConfiguration";

export default class GenericConfigurationService implements IGenericConfigurationServices {
    
    constructor() {
       
    }

    public getConfiguration(): Promise<GenericConfiguration> {
        return  sp.web.lists.getByTitle("Configurations").items.select("MyFood_HubServiceUrl", "MyFood_HubImageUrl").getById(1).get().then((data: any) => {
            let result: GenericConfiguration = {
                MyFood_HubServiceUrl: data.MyFood_HubServiceUrl,
                MyFood_HubImageUrl: data.MyFood_HubImageUrl,
                MyFood_HubSecureApiKey: data.MyFood_HubSecureApiKey
            };

            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

}