import * as React from "react";
import { Redirect } from 'react-router-dom';
import { GridLayout } from "@pnp/spfx-controls-react/lib/GridLayout";
import { Layer, Spinner, SpinnerSize, MessageBar, MessageBarType, Stack, StackItem,
     PrimaryButton,
      Button, ISize, IDocumentCardPreviewProps, ImageFit,
       DocumentCard, DocumentCardType, DocumentCardPreview,
        DocumentCardLocation, DocumentCardDetails, DocumentCardTitle,
         DocumentCardActivity, DocumentCardActions, SearchBox, ChoiceGroup, IChoiceGroupOption, Label } from "office-ui-fabric-react";
import styles from "../GestionCulture.module.scss";
import { IListDataStates } from "./IListDataStates";
import { IListDataProps } from "./IListDataProps";
import Consts from "../../../../Common/Constants";
import ZipGrowMap from "../Common/ZipGrowMap";
import * as strings from "GestionCultureWebPartStrings";
import CreationRecolteDialog from "../Dialogs/RecolteDialog";
import * as moment from "moment";
import ResumeConfiguration from "../Common/ResumeConfiguration";
import { ConfigureRenderer } from "../Common/ConfigureRenderer";
import { Item } from "@pnp/sp/items";


export default class EvolListData extends React.Component<IListDataProps, IListDataStates> {

    private initialItems: any[];

    constructor(props: any) {
        super(props);

        //intitialisation state composant.
    this.state = {
        configuration: null,
        error: '',
        items: [],
        selectionRedirect: false,
        newRedirect: false,
        selectedItem: null,
        growingType: null,
        isError: false,
        isLoaded: false,
        FitlterQRMode: false
    };

      this.initialItems = this.state.items;
      this.redirectToNew = this.redirectToNew.bind(this);
      this.loadData = this.loadData.bind(this);
      this.selectGrowingType = this.selectGrowingType.bind(this);
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
                {this.renderZipGrowMap()}
                {this.renderConfiguration()}
                {this.renderButton()}
                {this.renderFilter()}
                <StackItem>
                    <SearchBox placeholder={strings.SearchPlaceHolder} value={this.state.searchValue} iconProps={{iconName: 'Filter'}} 
                    onClear={this.loadData}
                    onChange={(newValue) => this.SearchData(newValue)}
                    onSearch={(newValue) => this.SearchData(newValue)} />
                </StackItem>
                <StackItem>           
                    <Label>{this.state.items.length} plantation en cours</Label>
                    <GridLayout
                        ariaLabel=""
                        items={this.state.items}
                        onRenderGridItem={(item: any, finalSize: ISize, isCompact: boolean) => this._onRenderGridItem(item, finalSize, isCompact)}
                    />
                </StackItem>
            </Stack>
          </div>
        );
    }

    private _onRenderGridItem = (item: any, finalSize: ISize, isCompact: boolean): JSX.Element => {
        const previewProps: IDocumentCardPreviewProps = {
          previewImages: [
            {
              previewImageSrc: item.MyFood_thumbnail != null ? item.MyFood_thumbnail : null,
              imageFit: ImageFit.cover,
              height: 130
            }
          ]
        };

        let documentCardActions = [
            {
                ariaLabel: this.props.archiveMode ? 'Voir' : 'Modifier',
                iconProps:{iconName:'Edit'},
                onClick: this.redirect.bind(this, item.Id)
            }
        ];

         //initialisation menu item
      if(!this.props.archiveMode) {
        documentCardActions.push(
            {
              ariaLabel: 'Recolter',
              iconProps:{iconName:'Accept'},
              onClick: this.showAndRecolteData.bind(this, item)
            },
            {
              ariaLabel: 'Supprimer',
              iconProps:{iconName:'Delete'},
              onClick: this.deleteData.bind(this, item.Id)
            }
          );
      }
    
        return <div data-is-focusable={true} role="listitem" aria-label={item.title}>
          <DocumentCard type={isCompact ? DocumentCardType.compact : DocumentCardType.normal}>
            <DocumentCardPreview {...previewProps} />
            {!isCompact && <DocumentCardLocation 
                location={this.CreateLabel(item)}
                onClick={()=> this.filterData(item.MyFood_ZipGrowID)} />}
            <DocumentCardDetails>
              <DocumentCardTitle
                title={item.MyFood_CultureType}
                shouldTruncate={true}
              />
              
              <DocumentCardActivity
                activity={moment(item.MyFood_CultureDate).locale('fr').format('L')}
                people={[{ name: item.name, profileImageSrc: item.profileImageSrc }]}
              />
            </DocumentCardDetails>
            <DocumentCardActions actions={documentCardActions}  />
          </DocumentCard>
        </div>;
      }

      private CreateLabel(item: any) : string {
          let label: string;
          if(item.MyFood_ZipGrowID != null) { // cas des tour 
            label = `Tour n° : ${item.MyFood_ZipGrowID} Type : ${item.MyFood_zipGrowType != null ? item.MyFood_zipGrowType : ''}`;
          } else {
              label = `Conteneur : ${item.MyFood_SerreType}`; 
          }

          return label;  
      }

    private loadData() : void {
        let promises = [];
        let items: any[];
        let config: any[];

        promises.push(
            //information from HUB
            this.props.myfoodHubService.getInformationFromHub(this.props.webpartContext.pageContext.user.email).then(val => {
                config = val;
            }),
            //information suivi
            this.props.suiviService.GetAllData(this.props.webpartContext.pageContext.legacyPageContext["userId"],
                 this.props.archiveMode).then(val => {
                items = val;
                this.setState({items: val, isLoaded: true} );
            }),
            //information type de serre
            this.props.suiviService.GetGrowingType().then(data => {
                let groups: IChoiceGroupOption[] = [];

                data.map(val => {
                    let iconName: string;

                    switch(val) {
                        case 'City':
                        case 'Familly':
                            iconName = 'ChartSeries';
                        break;

                        case 'Aerospring':
                            iconName ='Precipitation';
                        break;

                        case 'Bac Perma':
                            iconName='RectangleShape';
                        break;

                        case 'Incubateur': 
                        iconName='Inbox';
                    }

                    groups.push(
                        {
                            key: val,
                            iconProps: { iconName: iconName },
                            text: val, // This text is long to show text wrapping.
                        }
                    );
                });
                
                //add other group
                groups.push({
                    key: 'Tous',
                    iconProps: { iconName: 'AllApps' },
                    text: 'Tous', // This text is long to show text wrapping.
                });

                this.setState({growingType: groups});
            })
          );
          
          Promise.all(promises).then(() => {
              this.initialItems = items;

              //laucnh search by ZipGrowType if available
              if(this.props.match.params.numero != null) {
                let num = this.props.match.params.numero.split('=')[1];

                if(num != null) {
                    this.SearchData(num);
                    this.setState({isLoaded: true, FitlterQRMode: true, configuration: config.length != 0 ? config[0] : null});
                }
              }
              else {
                this.setState({items: items, isLoaded: true, FitlterQRMode: false, configuration: config.length != 0 ? config[0] : null});
              }
          }).catch((error) => {
            this.setState({isError: true, isLoaded: true, error: error.toString()});
        });
    }

    private SearchData(value) : void {

        if(value != null && value != '') {
            this.setState({items: this.state.items.filter(item => 
                item.MyFood_CultureType.toLowerCase().startsWith(value.toLowerCase()) || 
                item.MyFood_ZipGrowID == value ||
                item.MyFood_SerreType == value)});
        }
        else {
            this.setState({items: this.initialItems});
        }
    }

    private filterData(filter: string) : void {
        this.setState({isLoaded: false});
        this.props.suiviService.getDataForZipGrow(this.props.webpartContext.pageContext.legacyPageContext["userId"],
            this.props.archiveMode,filter).then(val => {
            this.setState({items: val, isLoaded: true} );
        }).catch((error) => {
            this.setState({isError: true, isLoaded: true, error: error.toString()});
        });
    }

    private filterByType(filter: string) : void {
        this.setState({isLoaded: false});
        this.props.suiviService.GetDataForGrowingType(this.props.webpartContext.pageContext.legacyPageContext["userId"],
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

    private showAndRecolteData = (item: any) : void => {
        const dialog = new CreationRecolteDialog(this.props.suiviService,item);
        dialog.show().then(() => {
            if(dialog.result.status == 'OK') {
                this.loadData();
            }
            else if(dialog.result.status == 'NOK') {
                this.setState({isLoaded: true, error: dialog.result.error});
            }
        }).catch((error) => {
            this.setState({isLoaded: true, error: error.toString()});
        });
    }

    private recolteData = (error: any) : void => {
        if(error.return == 'OK') {
            this.loadData();
        }
        else if(error.return =='NOK') {
            this.setState({isLoaded: true, error: error.error});
        }
    }

    private selectGrowingType(event: React.FormEvent<HTMLDivElement>, item: IChoiceGroupOption) : void {
        if(item && item.key != 'Tous')
        {
            this.filterByType(item.key.toString());
        }
        else {
            this.loadData();
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
                    onDismiss={ (ev) => this.clearError()}>{this.state.error}</MessageBar>
            </div>
            );
        }
    }

    private renderConfiguration() {
        if(!this.state.FitlterQRMode) {
            if(this.state.configuration != null) {
                return (
                    <StackItem>
                        <ResumeConfiguration webpartContext={this.props.webpartContext} 
                            dataContext={this.state.configuration}
                            myfoodhub_ImageUrl={this.props.configuration.MyFood_HubImageUrl} />
                    </StackItem>
            ); 
            }
            else {
                return (
                    <StackItem>
                        <ConfigureRenderer />
                    </StackItem>);
            }
        }
    }

    private renderZipGrowMap() {
        if(!this.state.FitlterQRMode) {
            return (
                 <StackItem>
                    <ZipGrowMap setFiltering={this.filtering}/>
                </StackItem>);
        }
    }

    private renderButton() {
        if(!this.state.FitlterQRMode) {
            return (
                <StackItem>
                    {!this.props.archiveMode &&
                        <PrimaryButton iconProps={{iconName: 'Add'} } text="Ajouter une culture" onClick={this.redirectToNew}/>
                    }
                    <Button iconProps={{iconName: 'EraseTool'}} text="Effacer le filtre" onClick={this.loadData}/>
                </StackItem>
            );
        }
    } 

    private renderFilter() {
        if(!this.state.FitlterQRMode) {
            return ( 
            <StackItem>
                {this.state.growingType != null && 
                    <ChoiceGroup label={strings.GrowingTypeText} defaultSelectedKey="Tous" options={this.state.growingType}
                        onChange={this.selectGrowingType} />
                }
            </StackItem>);
        } 
    }

    private clearError() {
        this.setState( (prevState, props) => {
          return {...prevState, error: '', isError: false};
        } );
    }
}