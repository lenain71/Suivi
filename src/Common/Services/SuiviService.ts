import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { ISuiviService } from "../Contracts/ISuiviService";
import { IItemUpdateResult } from "@pnp/sp/items";
import { Attachement } from "../Entities/Attachement";

export class SuiviService implements ISuiviService {

    constructor() {
       
    }

    public async GetAttachmentForSuivi(itemId: string): Promise<Attachement[]> {
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
        }

    public async RecolteData(itemId: string, comment: string, weigth: number): Promise<IItemUpdateResult> {

        return await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).update({
            InProduction: false,
            MyFood_RecolteKG: weigth,
            MyFood_RecolteRemarque: comment,
            MyFood_RecolteDate: new Date().toJSON()
        });
    }

    public async DeleteData(itemId: string): Promise<void> {
        return await sp.web.lists.getByTitle("Suivi").items.getById(Number(itemId)).delete();
    }

    public async GetAllData(user: string, archive: boolean) : Promise<any[]> {
        let typeCultureData = new Array<any>();
        let resultArray = new Array<any>();
        //get all cuture types used after to map and get MyFood_thumbnail parameters (cannot expand Image type filed from lookup) 
        return await sp.web.lists.getByTitle("Types de Cultures").items
        .select("Id","MyFood_thumbnail")
        .orderBy("Title",true).get().then((data: any) => {
            data.map((item, idx)=> {
                let result: any = {
                    id: item.Id,
                    thumbnail: item.MyFood_thumbnail != null ? item.MyFood_thumbnail.Url : ''
                };
                typeCultureData.push(result);
            });

            //call effective request
            return sp.web.lists.getByTitle("Suivi").items
            .select("MyFood_CultureDate","MyFood_zipGrowType","Id","MyFood_ZipGrowID","MyFood_thumbnail","CultureTestId","CultureTest/Title")
            .expand("CultureTest")
            .filter(`Author eq ${user} and InProduction eq ${!archive ? 1 : 0}`)
            .orderBy("MyFood_CultureDate", true).get().then((d: any) => {
                d.map((it) => {
                    let res: any = {
                        Id: it.Id,
                        MyFood_CultureType: it.CultureTest.Title,
                        MyFood_CultureDate: it.MyFood_CultureDate,
                        MyFood_ZipGrowID: it.MyFood_ZipGrowID,
                        MyFood_zipGrowType: it.MyFood_zipGrowType,
                        MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                         ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                    };

                    resultArray.push(res);
                });

                return Promise.resolve(resultArray);
            });
        });
    }

    public async getDataForZipGrow(user: string, archive: boolean,zipGrowID: string): Promise<any[]> {

        let typeCultureData = new Array<any>();
        let resultArray = new Array<any>();

         //get all cuture types used after to map and get MyFood_thumbnail parameters (cannot expand Image type filed from lookup) 
         return await sp.web.lists.getByTitle("Types de Cultures").items
         .select("Id","MyFood_thumbnail")
         .orderBy("Title",true).get().then((data: any) => {
             data.map((item, idx)=> {
                 let result: any = {
                     id: item.Id,
                     thumbnail: item.MyFood_thumbnail != null ? item.MyFood_thumbnail.Url : ''
                 };
                 typeCultureData.push(result);
             });

             return sp.web.lists.getByTitle("Suivi").items
                .select("MyFood_CultureDate","MyFood_zipGrowType","Id","MyFood_ZipGrowID","MyFood_thumbnail","CultureTestId","CultureTest/Title")
                .expand("CultureTest")
                .filter(`Author eq ${user} and MyFood_ZipGrowID eq ${zipGrowID} and InProduction eq ${!archive ? 1 : 0}`)
                .orderBy("MyFood_CultureDate", true).get().then((d: any) => {
                    d.map((it) => {
                        let res: any = {
                            Id: it.Id,
                            MyFood_CultureType: it.CultureTest.Title,
                            MyFood_CultureDate: it.MyFood_CultureDate,
                            MyFood_ZipGrowID: it.MyFood_ZipGrowID,
                            MyFood_zipGrowType: it.MyFood_zipGrowType,
                            MyFood_thumbnail : typeCultureData.filter(i => i.id === it.CultureTestId)[0]!= null
                            ?typeCultureData.filter(i => i.id === it.CultureTestId)[0].thumbnail : '',
                        };

                        resultArray.push(res);
                    });

                    return Promise.resolve(resultArray);

                    });
        });
    }
}
