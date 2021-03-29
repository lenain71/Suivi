import { Text } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IListService } from '../Contracts/IListService';
import handleError from '../ErrorHandling/handleError';



export class ListService implements IListService {

    private spHttpClient: SPHttpClient;

    constructor(spHttpClient: SPHttpClient) {
        this.spHttpClient = spHttpClient;
    }

    public getListsFromWeb(webUrl: string): Promise<Array<{url: string, title: string, id: string}>> {
        return new Promise<Array<{url: string, title: string, id: string}>>((resolve, reject) => {
            const endpoint = Text.format('{0}/_api/web/lists?$select=Id,Title,RootFolder/ServerRelativeUrl&$filter=(IsPrivate eq false) and (IsCatalog eq false) and (Hidden eq false)&$expand=RootFolder', webUrl);
            this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((data: any) => {
                        const listTitles: Array<{url: string, title: string, id: string}> = data.value.map((list) => {
                                return {url: list.RootFolder.ServerRelativeUrl, title: list.Title, id: list.Id};
                            });
                        resolve( listTitles.sort( (a, b) => a.title.localeCompare(b.title)) );
                    })
                    .catch((error) => { handleError(error); reject(error); });
                } else {
                    reject(response);
                }
            })
            .catch((error) => { handleError(error); reject(error); });
        });
    }

}
