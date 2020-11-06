import { IItemUpdateResult } from "@pnp/sp/items";
import { Attachement } from "../Entities/Attachement";

export interface ISuiviService {
    GetAllData(user: string, archive: boolean) : Promise<any[]>;
    getDataForZipGrow(user: string, archive: boolean,zipGrowID: string): Promise<any[]>;
    GetAttachmentForSuivi(itemId: string) : Promise<Attachement[]>;
    RecolteData(itemId: string, comment: string, weight?: number) : Promise<IItemUpdateResult>;
    DeleteData(itemId: string) : Promise<void>;
}