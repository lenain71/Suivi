import { IGestionCultureProps } from "../IGestionCultureProps";

export class IListDataProps extends IGestionCultureProps {
   public archiveMode: boolean;
    public updateSelectedItemId?(id: string): void;
}