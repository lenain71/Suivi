import * as React from "react";
import { Redirect } from 'react-router-dom';
import { GridLayout } from "@pnp/spfx-controls-react/lib/GridLayout";
import { Layer, Spinner, SpinnerSize, MessageBar, MessageBarType, Stack, StackItem, IStackTokens, PrimaryButton, TooltipHost, isElementFocusSubZone, Button, ISize, IDocumentCardPreviewProps, ImageFit, DocumentCard, DocumentCardType, DocumentCardPreview, DocumentCardLocation, DocumentCardDetails, DocumentCardTitle, DocumentCardActivity, DocumentCardActions } from "office-ui-fabric-react";
import styles from "../GestionCulture.module.scss";
import { IListDataStates } from "./IListDataStates";
import { IListDataProps } from "./IListDataProps";
import Consts from "../../../../Common/Constants";
import ZipGrowMap from "../Common/ZipGrowMap";
import * as strings from "GestionCultureWebPartStrings";
import CreationRecolteDialog from "../Dialogs/RecolteDialog";
import * as moment from "moment";
import ResumeConfiguration from "../Common/ResumeConfiguration";


export default class EvolListData extends React.Component<IListDataProps, IListDataStates> {

    constructor(props: any) {
        super(props);

        //intitialisation state composant.
    this.state = {
        configuration: null,
        errors: [],
        items: [],
        selectionRedirect: false,
        newRedirect: false,
        selectedItem: null,
        isError: false,
        isLoaded: false
      };

      this.redirectToNew = this.redirectToNew.bind(this);
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
                    {this.state.configuration != null && 
                        <ResumeConfiguration webpartContext={this.props.webpartContext} 
                            dataContext={this.state.configuration}
                            myfoodhub_ImageUrl={this.props.configuration.MyFood_HubImageUrl} />
                    }
                </StackItem>
                <StackItem>
                    {!this.props.archiveMode &&
                        <PrimaryButton iconProps={{iconName: 'Add'} } text="Ajouter une culture" onClick={this.redirectToNew}/>
                    }
                    <Button iconProps={{iconName: 'EraseTool'}} text="Effacer le filtre" onClick={this.loadData}/>
                </StackItem>
                <StackItem>
                    <GridLayout
                        ariaLabel="List of content, use right and left arrow keys to navigate, arrow down to access details."
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
                location={ `Tour n° : ${item.MyFood_ZipGrowID} Type : ${item.MyFood_zipGrowType}`}
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

    private loadData() : void {

        let promises = [];

        let items: any[];
        let config: any[];

        promises.push(
            this.props.myfoodHubService.getInformationFromHub(this.props.webpartContext.pageContext.user.email).then(val => {
                config = val;
            }),
            this.props.suiviService.GetAllData(this.props.webpartContext.pageContext.legacyPageContext["userId"],
                 this.props.archiveMode).then(val => {
                items = val;
                this.setState({items: val, isLoaded: true} );
            })
          );
          
          Promise.all(promises).then(() => {
              this.setState({items: items, isLoaded: true, configuration: config.length != 0 ? config[0] : null});
          }).catch((error) => {
            this.setState({isError: true, isLoaded: true, errors: [...this.state.errors,error]});
        });
    }

    private filterData(filter: string) : void {
        this.props.suiviService.getDataForZipGrow(this.props.webpartContext.pageContext.legacyPageContext["userId"],
            this.props.archiveMode,filter).then(val => {
            this.setState({items: val, isLoaded: true} );
        }).catch((error) => {
            this.setState({isError: true, isLoaded: true, errors: [...this.state.errors, error]});
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
            this.setState({isError: true, errors: [...this.state.errors, error]});
        });
    }

    private showAndRecolteData = (item: any) : void => {
        const dialog = new CreationRecolteDialog(this.props.suiviService,item);
        dialog.show().then(() => {
            if(dialog.result.status == 'OK') {
                this.loadData();
            }
            else if(dialog.result.status == 'NOK') {
                this.setState({isLoaded: true, errors: [...this.state.errors,dialog.result.error]});
            }
        }).catch((error) => {
            this.setState({isLoaded: true, errors: [...this.state.errors,error]});
        });
    }

    private recolteData = (error: any) : void => {
        if(error.return == 'OK') {
            this.loadData();
        }
        else if(error.return =='NOK') {
            this.setState({isLoaded: true, errors: [...this.state.errors, error.error]});
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
        if(this.state.errors.length > 0)
        {
            return <div>
            {
                this.state.errors.map( (item, idx) =>
                    <MessageBar
                    messageBarType={ MessageBarType.error }
                    isMultiline={ true }
                    onDismiss={ (ev) => this.clearError(idx) }>{item}</MessageBar>
                )
            }
            </div>;
        }
    }

    private clearError(idx: number) {
        this.setState( (prevState, props) => {
          return {...prevState, errors: prevState.errors.splice( idx, 1 )};
        } );
    }
}