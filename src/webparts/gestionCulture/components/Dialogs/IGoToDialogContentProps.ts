import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";

export default interface IGoToDialogContentProps {
    itemId?: string;
    //zipGrowID?: string;
    close: () => void;
    submit(request: any): void;
    suiviService: ISuiviService;
    user: string;
}