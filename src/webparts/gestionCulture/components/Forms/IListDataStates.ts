import { IGenericStates } from "../../../../Common/IGenericState";
import MyFoodHubConfiguration from "../../../../Common/Entities/MyFoodHubConfiguration";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IChoiceGroupOption } from "office-ui-fabric-react";

export class IListDataStates extends IGenericStates {
    public configuration: MyFoodHubConfiguration;
    public items: any[];
    public selectionRedirect: boolean;
    public newRedirect: boolean;
    public selectedItem: any;
    public currentFiltering? : string;
    public searchValue?: string;
    public growingType: IChoiceGroupOption[];
}