import { AvailableGraphData, CategoryGraphData } from "../Entities/GraphData";
import Growing from "../Entities/Growing";

export interface IGraphDataService {
    getLastGrowingDate(): Promise<Date>;
    getLastharvestDate(): Promise<Date>;
    getAvailableZipGrowCount(): Promise<AvailableGraphData>;
    getGrowingDataHistory(): Promise<Growing>;
    getGrowingDataByCategory(): Promise<CategoryGraphData>;
    getListsFromWeb(webUrl: string): Promise<Array<{url: string, title: string, id: string}>>;
}