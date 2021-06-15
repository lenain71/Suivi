import { sp } from "@pnp/sp";
import { getResourceUrl } from "office-ui-fabric-react";
import { IGraphDataService } from "../Contracts/IGraphDataService";
import { AvailableGraphData, CategoryGraphData } from "../Entities/GraphData";
import Growing from "../Entities/Growing";
import handleError from "../ErrorHandling/handleError";

export default class GraphDataService implements IGraphDataService
{
    public async getLastGrowingDate(user: string): Promise<Date> {
        try {
            return sp.web.lists.getByTitle("Semis").items
            .select("MyFood_CultureDate")
            .filter(`Author eq ${user} and InProduction eq 0 `)
            .orderBy("MyFood_CultureDate", true).top(1).get();
        } catch (error) {
            handleError(error);
        } 
      
    }
    public async getLastharvestDate(user: string): Promise<Date> {
        try {
            return await sp.web.lists.getByTitle("Suivi").items
            .select("MyFood_CultureDate")
            .filter(`Author eq ${user} and InProduction eq  0`)
            .orderBy("MyFood_CultureDate", true).top(1).get();   
        } catch (error) {
            handleError(error);
        }
    }
    public async getAvailableZipGrowCount(user : string): Promise<CategoryGraphData[]> {

        try {
            let result: CategoryGraphData[] = [];

            //first get zipgrowcount in production
            let zipgrowGrande = await sp.web.lists.getByTitle("Suivi").items
            .select("MyFood_ZipGrowID","MyFood_zipGrowType")
            .filter("MyFood_zipGrowType eq 'Grande' and InProduction eq 1").get();
    
            let zipgrowPetite = await sp.web.lists.getByTitle("Suivi").items
            .select("MyFood_ZipGrowID","MyFood_zipGrowType")
            .filter("MyFood_zipGrowType eq 'Petite' and InProduction eq 1").get();
    
            //distinct number of zipGrow
            let zipgrowGrandeCount =  zipgrowGrande.filter((v, i, a) => a.indexOf(v) === i).length;
            let zipgrowPetiteCount =  zipgrowPetite.filter((v, i, a) => a.indexOf(v) === i).length;
        
            //get data from SP
           let data = await sp.web.lists.getByTitle("Suivi").items
           .select("MyFood_zipGrowType","MyFood_ZipGrowID")
           .filter(`Author eq ${user} and InProduction eq 1 `)
           .orderBy("MyFood_zipGrowType", true).get();
    
           //transform data by grouping by MyFood_zipGrowType
           let transformData = data.reduce((r, d) => {
            const {
                MyFood_zipGrowType,
                MyFood_ZipGrowID
              } = d;
            
              r[MyFood_zipGrowType] = [...r[MyFood_zipGrowType] || [], {
                MyFood_ZipGrowID
              }];
            
              return r;
            },{});
    
            //calculate available by type : Petite = 6, grande 8
            if(transformData.Grande != null) {
                result.push(
                    { 
                        AvailableSlot: (8 - transformData.grande.length) * zipgrowGrandeCount,
                        UsedSlot: transformData.grande.length,
                        Category: "Grande",
                        TotalCount: zipgrowGrandeCount 
                    });
            }
            else {
                result.push(
                    { 
                        AvailableSlot: 8 * zipgrowGrandeCount,
                        UsedSlot: 0,
                        Category: "Grande",
                        TotalCount: zipgrowGrandeCount
                    });
            }
    
            if(transformData.Petite != null) {
                result.push(
                    { 
                        AvailableSlot: (6 - transformData.Petite.length) * zipgrowPetiteCount,
                        UsedSlot:transformData.Petite.length,
                        Category: "Petite",
                        TotalCount: zipgrowPetiteCount 
                    });
            }
            else {
                result.push(
                    { 
                        AvailableSlot: 6 * zipgrowPetiteCount,
                        UsedSlot: 0,
                        Category: "Petite",
                        TotalCount: zipgrowPetiteCount
                    });
            }
    
            return Promise.resolve(result);   
        } catch (error) {
            handleError(error);
            return Promise.reject(error);
        }
    }
    public async getGrowingDataHistory(): Promise<Growing> {
        try {
          // let data = await sp.web.lists.getByTitle("Suivi").items
        // .select("MyFood_zipGrowType","MyFood_ZipGrowID","CultureTestId","CultureTest/Title")
        // .expand("CultureTest")
        // .filter(`Author eq ${user} and InProduction eq 1`)
        // .orderBy("MyFood_zipGrowType", true).get();
        throw new Error("Method not implemented.");   
        } catch (error) {
            handleError(error);
            return Promise.reject(error);    
        }
    }
    public getGrowingDataByCategory(): Promise<CategoryGraphData> {
        try {
            throw new Error("Method not implemented.");    
        } catch (error) {
            handleError(error);
            return Promise.reject(error);
        }
        
    }
    public getListsFromWeb(webUrl: string): Promise<{ url: string; title: string; id: string; }[]> {
        try {
            throw new Error("Method not implemented.");    
        } catch (error) {
            handleError(error);
            return Promise.reject(error);
        }
        
    }
    
}