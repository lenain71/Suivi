import { ControlMode } from "neos-generic-components/lib/common/datatypes/ControlMode";
import { IFieldConfiguration } from "neos-generic-components/lib/webparts/detailListForm/components/IFieldConfiguration";
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISuiviService } from "../../../Common/Contracts/ISuiviService";
import { IGenericProps } from "../../../Common/IGenericProps";
import { IMyFoodHubService } from "../../../Common/Contracts/IMyFoodHubService";
import GenericConfiguration from "../../../Common/Entities/GenericConfiguration";
import { ISemisService } from "../../../Common/Contracts/ISemisService";
import { IGraphDataService } from "../../../Common/Contracts/IGraphDataService";

export  class IGestionCultureProps implements IGenericProps {
  public match: any;
  public title: string;
  public description: string;
  public webUrl: string;
  public absoluteApplicationUrl: string;
  public baseNameRouteUrl: string;
  public listUrl: string;
  public semisListUrl: string;
  public listId: string;
  public creationMode: boolean;
  public formType: ControlMode;
  public itemId?: string;
  public showUnsupportedFields: boolean;
  public redirectUrl?: string;
  public fields?: IFieldConfiguration[];
  public httpClientContext: SPHttpClient;
  public webpartContext: WebPartContext;
  public onSubmitSucceeded?(id: number): void;
  public onSubmitFailed?(fieldErrors: any): void;
  public onUpdateFields?(newFields: IFieldConfiguration[]): void;
  public suiviService: ISuiviService;
  public semisService: ISemisService;
  public myfoodHubService: IMyFoodHubService;
  public graphService: IGraphDataService;
  public configuration: GenericConfiguration;
}
