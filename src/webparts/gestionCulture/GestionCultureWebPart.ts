import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'GestionCultureWebPartStrings';
import GestionCulture from './components/GestionCulture';
import { IGestionCultureProps } from './components/IGestionCultureProps';
import { ControlMode } from 'neos-generic-components/lib/common/datatypes/ControlMode';
import { IFieldConfiguration } from 'neos-generic-components/lib/webparts/detailListForm/components/IFieldConfiguration';
import { PropertyPaneAsyncDropdown } from 'neos-generic-components/lib/common/controls/PropertyPanelAsyncDropdown/PropertyPaneAsyncDropdown';
import { IDropdownOption, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { ListService } from '../../Common/Services/ListService';
import { get, update } from '@microsoft/sp-lodash-subset';
import { SuiviService } from '../../Common/Services/SuiviService';
import { IListService } from '../../Common/Contracts/IListService';
import { ISuiviService } from '../../Common/Contracts/ISuiviService';
import { sp } from '@pnp/sp';
import { IMyFoodHubService } from '../../Common/Contracts/IMyFoodHubService';
import MockMyFoodHubService from '../../Common/Services/MockMyFoodHubService';
import MyFoodHubService from '../../Common/Services/MyFoodHubService';
import { IGenericConfigurationServices } from '../../Common/Contracts/IGenericConfigurationServices';
import GenericConfigurationService from '../../Common/Services/GenericConfigurationService';
import { ISemisService } from '../../Common/Contracts/ISemisService';
import { SemisService } from '../../Common/Services/SemisService';

export interface IGestionCultureWebPartProps {
  
}

export default class GestionCultureWebPart extends BaseClientSideWebPart<IGestionCultureProps> {

  private listService: IListService;
  private suiviService: ISuiviService;
  private semisService: ISemisService;
  private myfoodHubService: IMyFoodHubService;
  private configService: IGenericConfigurationServices;
  private cachedLists = null;

  protected onInit() : Promise<void> {
    return super.onInit().then(() => {

      sp.setup({
        spfxContext: this.context
      });

      this.context.statusRenderer.displayLoadingIndicator(this.domElement,strings.MessageLoading);
      this.configService = new GenericConfigurationService();
      this.listService = new ListService(this.context.spHttpClient);
      this.suiviService = new SuiviService();
      this.semisService = new SemisService();
      
      this.properties.redirectUrl = window.location.href;
    });     
  }

  public render(): void {

    let itemId;
    if (this.properties.itemId) {
      itemId = Number(this.properties.itemId);
      if (isNaN(itemId)) {
        // if item Id is not a number we assume it is a query string parameter
        const urlParams = new URLSearchParams(window.location.search);
        itemId = Number(urlParams.get(this.properties.itemId));
      }
    }

    let element;
    if (Environment.type === EnvironmentType.Local) {
      // show message that local worbench is not supported
      element = React.createElement(
        MessageBar,
        {messageBarType: MessageBarType.blocked},
        strings.LocalWorkbenchUnsupported
      );

      this.context.statusRenderer.clearLoadingIndicator(this.domElement);
    ReactDom.render(element, this.domElement);
    this.renderCompleted();
    }
    else
    {

      //chargement asynchrone de la configuration

      this.configService.getConfiguration().then((config) => {
        this.properties.configuration = config;
        this.myfoodHubService = new MyFoodHubService(this.context.spHttpClient,this.properties.configuration);

        element = React.createElement(
          GestionCulture,
          {
            match: null,
            title: this.properties.title,
            description: this.properties.description,
            webUrl: this.context.pageContext.web.absoluteUrl,
            absoluteApplicationUrl: window.location.href,
            listUrl: this.properties.listUrl,
            semisListUrl: this.properties.semisListUrl,
            listId: this.properties.listId,
            itemId: '',
            fields: this.properties.fields,
            creationMode: this.properties.creationMode,
            formType: this.properties.formType,
            showUnsupportedFields: this.properties.showUnsupportedFields,
            httpClientContext: this.context.spHttpClient,
            webpartContext: this.context,
            onSubmitSucceeded: (id: number) => this.formSubmitted(id),
            onUpdateFields: (fields: IFieldConfiguration[]) => this.updateField(fields),
            semisService: this.semisService,
            suiviService: this.suiviService,
            myfoodHubService: this.myfoodHubService,
            configuration: this.properties.configuration
          });

          this.context.statusRenderer.clearLoadingIndicator(this.domElement);
          ReactDom.render(element, this.domElement);
          this.renderCompleted();
      }); 
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get isRenderAsync(): boolean {
    return true;
  }

  protected renderCompleted(): void {
    super.renderCompleted();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

    //propertyPanel
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
      const mainGroup = {
        groupName: strings.BasicGroupName,
        groupFields: [
          PropertyPaneTextField('title', {
            label: strings.TitleFieldLabel
          }),
          PropertyPaneTextField('description', {
            label: strings.DescriptionFieldLabel,
            multiline: true
          }),
         new PropertyPaneAsyncDropdown('listUrl', {
            label: strings.ListFieldLabel,
            loadOptions: this.loadLists.bind(this),
            onPropertyChange: this.onListChange.bind(this),
            selectedKey: this.properties.listUrl,
          }),
          new PropertyPaneAsyncDropdown('semisListUrl', {
            label: strings.SemisListFiedLabel,
            loadOptions: this.loadLists.bind(this),
            onPropertyChange: this.onListChange.bind(this),
            selectedKey: this.properties.semisListUrl,
          }),
         PropertyPaneDropdown('formType', {
            label: strings.FormTypeFieldLabel,
            options: Object.keys(ControlMode)
                             .map( (k) => ControlMode[k]).filter( (v) => typeof v === 'string' )
                               .map( (n) => ({key: ControlMode[n], text: n}) ),
            disabled: !this.properties.listUrl
          }),
          PropertyPaneToggle('creationMode', {
            label: strings.CreationModeLabel,       
          })
        ]
      };
    if (this.properties.formType !== ControlMode.New) {
      mainGroup.groupFields.push(
        PropertyPaneTextField( 'itemId', {
          label: strings.ItemIdFieldLabel,
          deferredValidationTime: 2000,
          description: strings.ItemIdFieldDescription
        }));
    }
    mainGroup.groupFields.push(
      PropertyPaneToggle('showUnsupportedFields', {
        label: strings.ShowUnsupportedFieldsLabel,
        disabled: !this.properties.listUrl
      })
    );
    mainGroup.groupFields.push(
      PropertyPaneTextField('redirectUrl', {
        label: strings.RedirectUrlFieldLabel,
        description: strings.RedirectUrlFieldDescription,
        disabled: !this.properties.listUrl
      })
    );
    
      return {
        pages: [
          {
            header: {
              description: strings.PropertyPaneDescription
            },
            groups: [mainGroup]
          }
        ]
      };
    }
  
    private loadLists(): Promise<IDropdownOption[]> {
      return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
        if (Environment.type === EnvironmentType.Local) {
          resolve( [{
              key: 'sharedDocuments',
              text: 'Shared Documents',
            },
            {
              key: 'someList',
              text: 'Some List',
            }] );
        } else if (Environment.type === EnvironmentType.SharePoint ||
                  Environment.type === EnvironmentType.ClassicSharePoint) {
          try {
            if (!this.cachedLists) {
              return this.listService.getListsFromWeb(this.context.pageContext.web.absoluteUrl)
                .then( (lists) => {
                  this.cachedLists = lists.map( (l) => ({ key: l.url, text: l.title, data: l.id } as IDropdownOption) );
                  resolve( this.cachedLists );
                } );
            } else {
              // using cached lists if available to avoid loading spinner every time property pane is refreshed
              return resolve( this.cachedLists );
            }
          } catch (error) {
            alert( strings.ErrorOnLoadingLists + error );
          }
        }
      });
    }
  
    private onListChange(propertyPath: string, newValue: any): void {
      const oldValue: any = get(this.properties, propertyPath);
      if (oldValue !== newValue) {
        this.properties.fields = null;
      }
      // store new value in web part properties
      update( this.properties, propertyPath, (): any => newValue );
      //get Selected ID list
      update(this.properties,"listId",(): any => this.cachedLists.find(e => e.key === newValue).data);

      // refresh property Pane
      this.context.propertyPane.refresh();
      // refresh web part
      this.render();
    }
  
    private formSubmitted(id: number) {
      if (this.properties.redirectUrl) {
        // redirect to configured URL after successfully submitting form
        window.location.href = this.properties.redirectUrl.replace('[ID]', id.toString() );
      }
    }
  
    private updateField(fields: IFieldConfiguration[]): any {
      this.properties.fields = fields;
      // render web part again so that React List Form component is rerendered with changed fields
      this.render();
    }
}
