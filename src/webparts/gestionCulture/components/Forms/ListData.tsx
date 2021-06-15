import * as React from "react";
import { Redirect } from 'react-router-dom';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Layer, Spinner, SpinnerSize, MessageBar, MessageBarType, Stack, StackItem, IStackTokens, PrimaryButton, TooltipHost, isElementFocusSubZone, Button } from "office-ui-fabric-react";
import styles from "../GestionCulture.module.scss";
import * as strings from "GestionCultureWebPartStrings";
import { IListDataStates } from "./IListDataStates";
import { IListDataProps } from "./IListDataProps";
import { IECBRendererProps } from "../Common/IECBRendererProps";
import { ECBRenderer } from "../Common/ECBRenderer";
import Consts from "../../../../Common/Constants";
import ZipGrowMap from "../Common/ZipGrowMap";
import Moment from 'react-moment';


export default class ListData extends React.Component<IListDataProps, IListDataStates> {

    private _redirectUrl: string;

    private  _viewFields: IViewField[] = [
        {
          name: 'MyFood_CultureType',
          displayName: 'Type Culture',
          sorting: true,
          isResizable: true,
          maxWidth: 80,   
        },
        {
            name:'',
            displayName:'',
            sorting:false,
            maxWidth:40,
            render: (rowitem: any) => {
                const element:React.ReactElement<IECBRendererProps> = React.createElement(
                  ECBRenderer, 
                  {
                    item: rowitem,
                    archiveMode: this.props.archiveMode,
                    suiviService: this.props.suiviService,
                    redirect: this.redirect,
                    delete: this.deleteData,
                    recolte: this.recolteData
                  }
                );
                return element;
              }   
        },
        {
          name: 'MyFood_CultureDate',
          displayName: 'Date de culture',
          sorting: true,
          isResizable: true,
          maxWidth: 80,
          render: (rowitem: any) => {
            return (
            <Moment locale="fr" format='L'>{rowitem.MyFood_CultureDate}</Moment>
            );
          }   
        },
        {
          name: 'MyFood_zipGrowType',
          displayName: "Type ZipGrow",
          sorting: true,
          maxWidth: 80
        },
        {
          name: 'Id',
          displayName: "ID",
          sorting: true,
          isResizable: true,
          maxWidth: 80
        },
        {
          name: 'MyFood_ZipGrowID',
          displayName: "Identifiant ZipGrow",
          sorting: true,
          isResizable: true,
          maxWidth: 80
        }
      ];
     
      private _groupByFields: IGrouping[] = [
        {
          name: "MyFood_ZipGrowID",
          order: GroupOrder.ascending
        }
      ];

    constructor(props: any) {
        super(props);

        //initilisation des membres
        this._redirectUrl = "NewEditData";

        //intitialisation state composant.
    this.state = {
        error: '',
        items: [],
        selectionRedirect: false,
        configuration: null,
        newRedirect: false,
        selectedItem: null,
        growingType: null,
        isError: false,
        isLoaded: false,
        FitlterQRMode: false
      };

      this.redirect = this.redirect.bind(this);
      this.redirectToNew = this.redirectToNew.bind(this);
      this.deleteData = this.deleteData.bind(this);
      this.recolteData = this.recolteData.bind(this);
      this.loadData = this.loadData.bind(this);
    }

    public componentDidMount() : void {
        
       this.loadData();
    }

    public componentDidUpdate() : void {
    }

    public render(): React.ReactElement<any> {
        return (
          <div>
            { this.renderErrors() }

            {this.state.selectionRedirect && 
                <Redirect to={{
                    pathname: this.props.archiveMode ? `/NewEditData/View:id=${this.state.selectedItem}` :  `/NewEditData/Update:id=${this.state.selectedItem}`,
                    state: { itemId: this.state.selectedItem }
                }}/>
            }

            {this.state.newRedirect &&
                <Redirect to="/NewEditData/New" />
            }

            {!this.state.isLoaded &&
              <Layer>
                <div className={styles.loaderRoot}>
                  <Spinner className={styles.loader} size={SpinnerSize.large} label={strings.Loading} />
                </div>
              </Layer>
            }
            <Stack tokens={Consts.verticalGapStackTokens}>
                <StackItem>
                    <ZipGrowMap setFiltering={this.filtering}/>
                </StackItem>
                <StackItem>
                    {!this.props.archiveMode &&
                        <PrimaryButton iconProps={{iconName: 'Add'} } text="Ajouter une culture" onClick={this.redirectToNew}/>
                    }
                    <Button iconProps={{iconName: 'EraseTool'}} text="Effacer le filtre" onClick={this.loadData}/>
                </StackItem>
                <StackItem>
                    <ListView items={this.state.items}
                        viewFields={this._viewFields}
                        compact={true}
                        selectionMode={SelectionMode.none}
                        showFilter={true}
                        filterPlaceHolder="Search..."
                        groupByFields={this._groupByFields} />
                </StackItem>
            </Stack>
          </div>
        );
    }

    private loadData() : void {
        this.props.suiviService.GetAllData(this.props.webpartContext.pageContext.legacyPageContext["userId"],
          this.props.archiveMode).then(val => {
            this.setState({items: val, isLoaded: true} );
        }).catch((error) => {
            this.setState({isError: true, isLoaded: true, error: error.toString()});
        });
    }

    private filterData(filter: string) : void {
        this.props.suiviService.getDataForZipGrow(this.props.webpartContext.pageContext.legacyPageContext["userId"],
          this.props.archiveMode,filter).then(val => {
            this.setState({items: val, isLoaded: true} );
        }).catch((error) => {
            this.setState({isError: true, isLoaded: true, error: error.toString()});
        });
    }

    //fonction calback de redirection/routing utilisé par les composants enfants
    private redirect = (id? : string): void => {
        this.props.updateSelectedItemId(id);
        this.setState({selectionRedirect: true, selectedItem: id });
    }

    private redirectToNew(): void {
        this.setState({newRedirect: true});
    }

    private deleteData = (id: string) : void => {
        this.setState({isLoaded: false});
        this.props.suiviService.DeleteData(id).then(() => {
            this.loadData();
        }).catch((error) => {
            this.setState({isError: true, error: error.toString()});
        });
    }

    private recolteData = (error: any) : void => {
        if(error.return == 'OK') {
            this.loadData();
        }
        else {
            this.setState({isLoaded: true, error: error.error});
        }
    }

    private filtering = (filter: string) : void => {
        if(filter != null) {
            this.filterData(filter);
        }
        else {
            this.loadData();
        }
    }

    private renderErrors() {
        if(this.state.isError)
        {
            return(
              <div>
                    <MessageBar
                    messageBarType={ MessageBarType.error }
                    isMultiline={ true }
                    onDismiss={ (ev) => this.clearError() }>{this.state.error}</MessageBar>
                
            
            </div>
            );
        }
    }

    private clearError() {
        this.setState( (prevState, props) => {
          return {...prevState, error: '', isError: false};
        } );
    }
}