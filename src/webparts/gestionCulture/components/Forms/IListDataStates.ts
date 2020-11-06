import { IGenericStates } from "../../../../Common/IGenericState";
import MyFoodHubConfiguration from "../../../../Common/Entities/MyFoodHubConfiguration";

export class IListDataStates extends IGenericStates {
    public configuration: MyFoodHubConfiguration;
    public items: any[];
    public selectionRedirect: boolean;
    public newRedirect: boolean;
    public selectedItem: any;
    public currentFiltering? : string;
}