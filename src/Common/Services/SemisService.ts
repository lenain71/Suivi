import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
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
            .top(5000)
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
                .orderBy("MyFood_CultureDate", true).top(5000).get().then((d: any) => {
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
           return Promise.reject(error);
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
            .top(5000)
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
                .orderBy("MyFood_CultureDate", true).top(5000).get().then((d: any) => {
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
            return Promise.reject(error);
        }
    }

    public async DuplicateData(itemId: string): Promise<void> {
        try {
            let data = await sp.web.lists.getByTitle("Semis").items.getById(Number(itemId)).get();
 
            if(data != null) {
                return await sp.web.lists.getByTitle("Semis").items.add(
                    {
                        ContentTypeId: data.ContentTypeId,
                        InProduction: true,
                        CultureTestId : data.CultureTestId,
                        MyFood_CultureDate: new Date().toJSON(),
                        MyFood_emplacement: data.MyFood_emplacement,
                        Title: data.Title    
                }).then((added) => {Promise.resolve(added);},(error) => {throw error;});
            }
        } catch (error) {
            handleError(error);
            return Promise.reject(error);
        }
     }

    public async DeleteData(itemId: string): Promise<void> {
        try {
            return await sp.web.lists.getByTitle("Semis").items.getById(Number(itemId)).delete();
        } catch (error) {
           handleError(error); 
           return Promise.reject(error);
        }
       
    }

}
