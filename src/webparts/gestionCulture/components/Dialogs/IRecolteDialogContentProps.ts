import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";

export default interface IRecolteDialogContentProps {
    itemId?: string;
    comment: string;
    weigth: string;
    close: () => void;
    submit(request: any): void;
    suiviService: ISuiviService;
}