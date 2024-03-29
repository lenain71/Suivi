import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { Attachement } from "../Entities/Attachement";

export interface ISuiviService {
    GetSpecificData(itemId: string) : Promise<any>;
    GetAllData(user: string, archive: boolean) : Promise<any[]>;
    getDataForZipGrow(user: string, archive: boolean,zipGrowID: string): Promise<any[]>;
    GetDataForGrowingType(user: string, archive: boolean, growingType: string): Promise<any[]>;
    GetZipGrowList(user: string): Promise<any[]>;
    GetGrowingType(): Promise<any[]>;
    GetAttachmentForSuivi(itemId: string) : Promise<Attachement[]>;
    RecolteData(itemId: string, comment: string, weight?: number) : Promise<IItemUpdateResult>;
    TransfertTo(itemId: string, zipGrowID: string, zipGrowType: string, serreType: string) : Promise<IItemAddResult>;
    DuplicateData(itemId: string) : Promise<void>;
    DeleteData(itemId: string) : Promise<void>;
}