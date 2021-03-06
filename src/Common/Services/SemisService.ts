import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { ISuiviService } from "../Contracts/ISuiviService";
import { IItemUpdateResult } from "@pnp/sp/items";
import { Attachement } from "../Entities/Attachement";
import { ISemisService } from "../Contracts/ISemisService";
import handleError from "../ErrorHandling/handleError";

export class SemisService implements ISemisService {

    constructor() {
       
    }
    public async getDataForEmplacement(user: string, archive: boolean, emplacement: string): Promise<any[]> {
        try {
            let typeCultureData = new Array<any>();
            let resultArray = new Array<any>();
            //get all cuture types used after to map and get MyFood_thumbnail parameters (cannot expand Image type filed from lookup) 
            return await sp.web.lists.getByTitle("Types de Cultures").items
            .select("Id","MyFood_thumbnail")
            .orderBy("Title",true)
            .usingCaching()
            .get().then((data: any) => {
                data.map((item, idx)=> {
                    let result: any = {
                        id: item.Id,
                        thumbnail: item.MyFood_thumbnail != null ? item.MyFood_thumbnail.Url : ''
                    };
                    typeCultureData.push(result);
                });
    
                //call effective request
                return sp.web.lists.getByTitle("Semis").items
                .select("MyFood_CultureDate","Id","MyFood_thumbnail","CultureTestId","CultureTest/Title","MyFood_emplacement")
                .expand("CultureTest")
                .filter(`Author eq ${user} and MyFood_emplacement eq '${emplacement}' and InProduction eq ${!archive ? 1 : 0}`)
                .orderBy("MyFood_CultureDate", true).get().then((d: any) => {
                    d.map((it) => {
                        let res: any = {
                            Id: it.Id,
                            MyFood_CultureType: it.CultureTest.Title,
                            MyFood_CultureDate: it.MyFood_CultureDate,
                            MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                             ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                             MyFood_emplacement: it.MyFood_emplacement 
                        };
    
                        resultArray.push(res);
                    });
    
                    return Promise.resolve(resultArray);
                });
            }).catch((error) => {
                handleError(error);
                return Promise.reject(error);
            });   
        } catch (error) {
           handleError(error); 
        }
    }

    public async GetAllData(user: string, archive: boolean) : Promise<any[]> {
        try {
            let typeCultureData = new Array<any>();
            let resultArray = new Array<any>();
            //get all cuture types used after to map and get MyFood_thumbnail parameters (cannot expand Image type filed from lookup) 
            return await sp.web.lists.getByTitle("Types de Cultures").items
            .select("Id","MyFood_thumbnail")
            .orderBy("Title",true)
            .usingCaching()
            .get().then((data: any) => {
                data.map((item, idx)=> {
                    let result: any = {
                        id: item.Id,
                        thumbnail: item.MyFood_thumbnail != null ? item.MyFood_thumbnail.Url : ''
                    };
                    typeCultureData.push(result);
                });
    
                //call effective request
                return sp.web.lists.getByTitle("Semis").items
                .select("MyFood_CultureDate","Id","MyFood_thumbnail","CultureTestId","CultureTest/Title","MyFood_emplacement")
                .expand("CultureTest")
                .filter(`Author eq ${user} and InProduction eq ${!archive ? 1 : 0}`)
                .orderBy("MyFood_CultureDate", true).get().then((d: any) => {
                    d.map((it) => {
                        let res: any = {
                            Id: it.Id,
                            MyFood_CultureType: it.CultureTest.Title,
                            MyFood_CultureDate: it.MyFood_CultureDate,
                            MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                             ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                             MyFood_emplacement: it.MyFood_emplacement 
                        };
    
                        resultArray.push(res);
                    });
    
                    return Promise.resolve(resultArray);
                });
            }).catch((error) => {
                handleError(error);
                return Promise.reject(error);
            });   
        } catch (error) {
            handleError(error);
        }
    }
}
