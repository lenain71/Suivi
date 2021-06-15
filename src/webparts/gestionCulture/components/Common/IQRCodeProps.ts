import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";

export interface IQRCodeProps {
    itemId: string;
    suiviService: ISuiviService;
    //identifier?: string;
    absoluteUrl: string;
}