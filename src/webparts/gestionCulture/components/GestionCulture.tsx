import * as React from 'react';
import { Stack, StackItem, Layer, Spinner, SpinnerSize, Pivot, PivotLinkFormat, PivotLinkSize, PivotItem, Label, MessageBar, MessageBarType, Link } from 'office-ui-fabric-react';
import {BrowserRouter, Router, Route, Switch, HashRouter, Redirect, Link as RouterLink } from 'react-router-dom';
import { LoadingComponent } from './Common/LoadingComponent';
import { IGestionCultureProps } from './IGestionCultureProps';
import { IGestionCultureStates } from './IGestionCultureStates';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GestionCulture.module.scss';
import * as strings from "GestionCultureWebPartStrings";

//inport internal SPA components
import NewEditData from './Forms/NewEditData';
import ListData from './Forms/ListData';
import EvolListData from './Forms/EvolListData';
import { ControlMode } from 'neos-generic-components/lib/common/datatypes/ControlMode';
import Consts from '../../../Common/Constants';
import SemisListData from './Forms/SemisListData';
import SemisNewEditData from './Forms/SemisNewEditData';
import GraphData from './Forms/GraphData';
import { Thumbs } from 'react-responsive-carousel';

export default class GestionCulture extends  React.Component<IGestionCultureProps, IGestionCultureStates> {
  
  private routes: any;

  constructor(props: IGestionCultureProps) {
    super(props);

    // this.baseNameRouteUrl = this.props.webpartContext.pageContext.site.serverRequestPath
    // .replace('/Semis','')
    // .replace('/Manage','')
    // .replace('/Archive','')
    // .replace('/Graph','');

    console.log(this.props.baseNameRouteUrl);

    //construction des routes de l'application SPA.
    this.routes = [
      {
        path: "/",
        exact: true,
        sensative: true,
        component: ({match}) => <EvolListData {...this.props} archiveMode={false} match={match} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },
      {
        path: "/Filter/Data:numero",
        exact: false,
        sensative: false,
        component: ({match}) => <EvolListData {...this.props} archiveMode={false} match={match} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },
      {
        path: "/Semis",
        sensative: false,
        exact: false,
        component: () => <SemisListData {...this.props} archiveMode={false}  updateSelectedItemId={(id) => this.updateSelectedItemId(id)} />
      },
      {
        path: "/Manage",
        sensative: false,
        exact: false,
        component: () => <ListData {...this.props} archiveMode={false} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
       },
      {
        path: "/NewEditData/New",
        sensative: false,
        exact: false,
        component: ({match}) => <NewEditData {...this.props} match={match} formType={ControlMode.New} />
      },
      {
        path: "/NewEditData/Update:id",
        sensative: false,
        exact: false,
        component: ({match}) => <NewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Edit} />
      },
      {
        path: "/NewEditData/View:id",
        sensative: false,
        exact: true,
        component: ({match}) => <NewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Display} />
      },
      {
        path: "/SemisNewEditData/New",
        sensative: false,
        exact: false,
        component: ({match}) => <SemisNewEditData {...this.props} match={match} formType={ControlMode.New} />
      },
      {
        path: "/SemisNewEditData/Update:id",
        sensative: false,
        exact: false,
        component: ({match}) => <SemisNewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Edit} />
      },
      {
        path: "/SemisNewEditData/View:id",
        sensative: false,
        exact: true,
        component: ({match}) => <SemisNewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Display} />
      },
      {
        path: "/Archive",
        sensative: false,
        exact: false,
        component: ({match}) => <EvolListData {...this.props} archiveMode={true} match={match} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },
      {
        path: "/Graph",
        sensative: false,
        exact: false,
        component:() => <GraphData {...this.props} />
      }
    ];

    //intitialisation state composant.
    this.state = {
      isError: false,
      isLoaded: false
    };

    this.onLinckClick = this.onLinckClick.bind(this);
  }

  public componentDidMount() : void {
    this.setState({isLoaded: true});
  }

  public componentDidCatch(error, errorInfo) {
    this.setState({isLoaded: false, isError: true});

    //LOG here

  }


  public render(): React.ReactElement<IGestionCultureProps> {
    return (
      <div>
        {!this.state.isLoaded &&
          <Layer>
            <div className={styles.loaderRoot}>
              <Spinner className={styles.loader} size={SpinnerSize.large} label={strings.Loading} />
            </div>
          </Layer>
        }
        
        {this.state.isError &&
                <MessageBar messageBarType={MessageBarType.error} isMultiline={false} onDismiss={this._dismissMessageBar} dismissButtonAriaLabel="Close">
                </MessageBar>
              }

        {/* <BrowserRouter basename='/sites/TestMyFood/SitePages/Test-MyFood-SUivi.aspx'> */}
      <BrowserRouter basename={this.props.baseNameRouteUrl}>
          {/* redirection effectuée par code en gérant un state car ne fonctionne pas directement en utilisant le <Redirect> */}
        {this.state.routeSelectedUrl &&
                <Redirect push to={this.state.routeSelectedUrl} />
            }
        <Pivot aria-label="Links of Large Tabs Pivot Example" 
          linkFormat={PivotLinkFormat.tabs}
          selectedKey={this.state.routeSelectedKey}
          onLinkClick={this.onLinckClick}
          linkSize={PivotLinkSize.large}>    
              <PivotItem headerText={strings.HomeNav} itemKey="home" itemIcon="Home" itemProp="/">
              </PivotItem>
              <PivotItem headerText={strings.SemisNav} itemKey="semis" itemIcon="Precipitation" itemProp="/Semis">
              </PivotItem>
              <PivotItem headerText={strings.ArchiveNav} itemKey="archive" itemIcon="Archive" itemProp="/Archive">
              </PivotItem>
              {/* <PivotItem headerText="Graph" itemKey="graph" itemIcon="FunnelChart" itemProp="/Graph">
              </PivotItem> */}
        </Pivot>
        <Stack tokens={Consts.verticalGapStackTokens}>
          <StackItem>
            <Switch> {this.routes.map((route, i) => (
                  <Route index={i} path={route.path} exact={route.exact} sensative={route.sensative} component={route.component} />
                ))}
            </Switch>
           </StackItem>
        </Stack>
        {/* </HashRouter> */}
      </BrowserRouter>
    </div>
    );
  }

    /**
   * Dismiss message bar
   */
  private _dismissMessageBar = () => {
    this.setState({ isError: false });
  }

  private onLinckClick(item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) {
    //on définit le state interne pour la redirection : utiliser surtout lors d'un appel direct avec l'url dans la barre d'adresse
    this.setState({routeSelectedKey : item.props.itemKey, routeSelectedUrl: item.props.itemProp});
  }

  //call back d'update de la selection 
  private updateSelectedItemId = (id: string): void => {
    this.setState({cultureSelected: id});
  }
}
