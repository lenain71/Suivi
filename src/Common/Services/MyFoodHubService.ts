import { IMyFoodHubService } from "../Contracts/IMyFoodHubService";
import MyFoodHubConfiguration from "../Entities/MyFoodHubConfiguration";
import { SPHttpClient, IHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import GenericConfiguration from "../Entities/GenericConfiguration";
import handleError from "../ErrorHandling/handleError";

export default class MyFoodHubService implements IMyFoodHubService
{
    private spHttpClient: SPHttpClient;
    private configuration: GenericConfiguration;

    constructor(spHttpClient: SPHttpClient, configuration: GenericConfiguration) {
        this.spHttpClient = spHttpClient;
        this.configuration = configuration;
    }

    public getInformationFromHub(username: string): Promise<MyFoodHubConfiguration[]> {

        let httpClientOptions: IHttpClientOptions = {  
            headers: {
                'authorization': `ApiKey ${this.configuration.MyFood_HubSecureApiKey}`
            },
            method: 'GET'
        };

        let url: string = `${this.configuration.MyFood_HubServiceUrl}/${encodeURIComponent(username)}/`;

        return this.spHttpClient.get(url, SPHttpClient.configurations.v1,httpClientOptions)  
                .then((response: SPHttpClientResponse) => {
                    if(response.ok) {
                        return response.json().then((data: any) => {
                            let result = new Array<MyFoodHubConfiguration>();
                            data.map((conf) => {
                                result.push(conf);
                            });
                            return Promise.resolve(result) ;
                        })
                        .catch((error) => {
                            handleError(error);
                            return Promise.reject(error);
                        }); 
                    
                    }
                    else
                    {
                        return Promise.reject(response.statusText);
                    }
                });
            } 
}