import { AvailableGraphData, CategoryGraphData } from "../Entities/GraphData";
import Growing from "../Entities/Growing";

export interface IGraphDataService {
    getLastGrowingDate(user: string): Promise<Date>;
    getLastharvestDate(user: string): Promise<Date>;
    getAvailableZipGrowCount(user : string): Promise<CategoryGraphData[]>;
    getGrowingDataHistory(): Promise<Growing>;
    getGrowingDataByCategory(): Promise<CategoryGraphData>;
    getListsFromWeb(webUrl: string): Promise<Array<{url: string, title: string, id: string}>>;
}