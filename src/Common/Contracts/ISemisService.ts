export interface ISemisService {
    GetAllData(user: string, archive: boolean) : Promise<any[]>;
    getDataForEmplacement(user: string, archive: boolean,zipGrowID: string): Promise<any[]>;
}