import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/attachments";
import { ISuiviService } from "../Contracts/ISuiviService";
import { IItem, IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { Attachement } from "../Entities/Attachement";
import { IFieldInfo } from "@pnp/sp/fields";
import handleError from "../ErrorHandling/handleError";

export class SuiviService implements ISuiviService {

    constructor() {
       
    }

    public async GetAttachmentForSuivi(itemId: string): Promise<Attachement[]> {
        try {
            return await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).attachmentFiles().then(data => {
                let imgs = new Array<Attachement>();
    
                    data.map(val => {
                        imgs.push({
                            ImageSrc: val.FileNameAsPath.DecodedUrl,
                            Title: val.FileName,
                            Description: null,
                            Url: val.ServerRelativeUrl,
                            ShowDetail: true
                            
                        });
                    });
                return imgs;
                });
        } catch (error) {
            handleError(error);
        }
        
    }

    public async GetZipGrowList(user: string) : Promise<any[]> {
        try {
            return await sp.web.lists.getByTitle("Suivi").items
            .select("MyFood_zipGrowType","MyFood_ZipGrowID","MyFood_SerreType")
            .filter(`Author eq ${user} and (MyFood_SerreType ne 'Incubateur' and MyFood_SerreType ne 'Aerospring' and MyFood_SerreType ne 'Bac Perma')`)
            .orderBy("MyFood_ZipGrowID", true)
            .usingCaching()
            .get();   
        } catch (error) {
            handleError(error);
        }
    }

     public async GetGrowingType(): Promise<any[]> {
         try {
            return await sp.web.lists.getByTitle("Suivi").fields.getByInternalNameOrTitle("MyFood_SerreType").select('Choices')
            .usingCaching()
            .get().then(
                (info: any) => {
                return info.Choices;
            });   
         } catch (error) {
             handleError(error);
         }
    }

    public async RecolteData(itemId: string, comment: string, weigth: number): Promise<IItemUpdateResult> {
        try {
            return await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).update({
                InProduction: false,
                MyFood_RecolteKG: weigth,
                MyFood_RecolteRemarque: comment,
                MyFood_RecolteDate: new Date().toJSON()
            });   
        } catch (error) {
            handleError(error);
        }
    }

    public async TransfertTo(itemId: string, zipGrowID: string, zipGrowType: string, serreType: string): Promise<IItemAddResult> {
      try {
        return await sp.web.lists.getByTitle("Semis").items.getById(Number(itemId))
        .select("MyFood_CultureDate","Id","CultureTestId","CultureTest/Title")
        .expand("CultureTest").get().then((semis) => {

            //cas particulier des bac perma/aerospring
            let _addingData;
            
            if((zipGrowID && zipGrowType == "Bac Perma") || (zipGrowID && zipGrowType == "Aerospring") ) {
                _addingData = {
                    Title: semis.CultureTest.Title,
                    MyFood_ZipGrowID: '',
                    MyFood_zipGrowType: '',
                    MyFood_SerreType: zipGrowType,
                    CultureTestId: semis.CultureTestId,
                    MyFood_CultureDate: new Date().toJSON(),
                    InProduction: true,
                };
            }
            else
            {
                _addingData = {
                    Title: semis.CultureTest.Title,
                    MyFood_ZipGrowID: zipGrowID,
                    MyFood_zipGrowType: zipGrowType,
                    MyFood_SerreType: serreType,
                    CultureTestId: semis.CultureTestId,
                    MyFood_CultureDate: new Date().toJSON(),
                    InProduction: true,
                };
            }

            return sp.web.lists.getByTitle('Suivi').items.add(_addingData).then(() =>{
                return sp.web.lists.getByTitle("Semis").items.getById(Number(itemId)).update({
                    InProduction: false
                });
            });
        });   
      } catch (error) {
          handleError(error);
      }
    }

    public async DeleteData(itemId: string): Promise<void> {
        try {
            return await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).delete();
        } catch (error) {
           handleError(error); 
        }
       
    }

    public async GetSpecificData(itemId: string) : Promise<any> {
        try {
            let data = await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).get();

            if(data != null) 
            {
                if(data.MyFood_ZipGrowID != null) {
                    return Promise.resolve(data.MyFood_ZipGrowID);
                }
                else {
                    return Promise.resolve(data.MyFood_SerreType);
                }
            }
            else
            {
                return Promise.resolve(null);
            }
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
                return sp.web.lists.getByTitle("Suivi").items
                .select("MyFood_CultureDate","MyFood_zipGrowType","MyFood_SerreType","Id","MyFood_ZipGrowID","MyFood_thumbnail","CultureTestId","CultureTest/Title")
                .expand("CultureTest")
                .filter(`Author eq ${user} and InProduction eq ${!archive ? 1 : 0}`)
                .orderBy("MyFood_CultureDate", true)
                .get().then((d: any) => {
                    d.map((it) => {
                        let res: any = {
                            Id: it.Id,
                            MyFood_CultureType: it.CultureTest.Title,
                            MyFood_CultureDate: it.MyFood_CultureDate,
                            MyFood_ZipGrowID: it.MyFood_ZipGrowID,
                            MyFood_zipGrowType: it.MyFood_zipGrowType,
                            MyFood_SerreType: it.MyFood_SerreType,
                            MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                             ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                        };
    
                        resultArray.push(res);
                    });
    
                    return Promise.resolve(resultArray);
                });
            });   
        } catch (error) {
            handleError(error);
        }
    }

    public async getDataForZipGrow(user: string, archive: boolean,zipGrowID: string): Promise<any[]> {

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
    
                 return sp.web.lists.getByTitle("Suivi").items
                    .select("MyFood_CultureDate","MyFood_zipGrowType","MyFood_SerreType","Id","MyFood_ZipGrowID","MyFood_thumbnail","CultureTestId","CultureTest/Title")
                    .expand("CultureTest")
                    .filter(`Author eq ${user} and MyFood_ZipGrowID eq ${zipGrowID} and InProduction eq ${!archive ? 1 : 0}`)
                    .orderBy("MyFood_CultureDate", true)
                    .get().then((d: any) => {
                        d.map((it) => {
                            let res: any = {
                                Id: it.Id,
                                MyFood_CultureType: it.CultureTest.Title,
                                MyFood_CultureDate: it.MyFood_CultureDate,
                                MyFood_ZipGrowID: it.MyFood_ZipGrowID,
                                MyFood_zipGrowType: it.MyFood_zipGrowType,
                                MyFood_SerreType: it.MyFood_SerreType,
                                MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                                ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                            };
    
                            resultArray.push(res);
                        });
    
                        return Promise.resolve(resultArray);
    
                }).catch((error) => {
                    handleError(error);
                    return Promise.reject(error);
                });
            });   
        } catch (error) {
            handleError(error);
        }
    }

    public async GetDataForGrowingType(user: string, archive: boolean, growingType: string): Promise<any[]> {
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
    
                 return sp.web.lists.getByTitle("Suivi").items
                    .select("MyFood_CultureDate","MyFood_zipGrowType","MyFood_SerreType","Id","MyFood_ZipGrowID","MyFood_thumbnail","CultureTestId","CultureTest/Title")
                    .expand("CultureTest")
                    .filter(`Author eq ${user} and MyFood_SerreType eq '${growingType}' and InProduction eq ${!archive ? 1 : 0}`)
                    .orderBy("MyFood_CultureDate", true).get().then((d: any) => {
                        d.map((it) => {
                            let res: any = {
                                Id: it.Id,
                                MyFood_CultureType: it.CultureTest.Title,
                                MyFood_CultureDate: it.MyFood_CultureDate,
                                MyFood_ZipGrowID: it.MyFood_ZipGrowID,
                                MyFood_zipGrowType: it.MyFood_zipGrowType,
                                MyFood_SerreType: it.MyFood_SerreType,
                                MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                                ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
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
