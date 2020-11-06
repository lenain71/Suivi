import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";

export interface IECBRendererProps {
    archiveMode: boolean;
    item: any;
    redirect(id? : string): void;
    delete(id: string): void;
    recolte(val: any) : void;
    suiviService: ISuiviService;
}