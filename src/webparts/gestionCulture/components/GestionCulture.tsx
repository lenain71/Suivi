import * as React from 'react';
import { Stack, StackItem, Layer, Spinner, SpinnerSize, Pivot, PivotLinkFormat, PivotLinkSize, PivotItem, Label, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import {BrowserRouter, Route, Switch, HashRouter, Redirect } from 'react-router-dom';

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

export default class GestionCulture extends React.Component<IGestionCultureProps, IGestionCultureStates> {
  
  private routes: any;

  constructor(props: IGestionCultureProps) {
    super(props);

    //construction des routes de l'application SPA.
    this.routes = [
      /*{
        path: "/",
        exact: true,
        component: () => <ListData {...this.props} archiveMode={false} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },*/
      {
        path: "/",
        exact: true,
        component: () => <EvolListData {...this.props} archiveMode={false} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },
      {
        path: "/Manage",
        exact: false,
        component: () => <ListData {...this.props} archiveMode={false} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },
      {
        path: "/NewEditData/New",
        exact: false,
        component: ({match}) => <NewEditData {...this.props} match={match} formType={ControlMode.New} />
      },
      {
        path: "/NewEditData/Update:id",
        exact: false,
        component: ({match}) => <NewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Edit} />
      },
      {
        path: "/NewEditData/View:id",
        exact: false,
        component: ({match}) => <NewEditData {...this.props} match={match} itemId={this.state.cultureSelected} 
        formType={ControlMode.Display} />
      },
      /*{
        path: "/Archive",
        exact: false,
        component: () => <ListData {...this.props} archiveMode={true} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      },*/
      {
        path: "/Archive",
        exact: false,
        component: () => <EvolListData {...this.props} archiveMode={true} updateSelectedItemId={(id) => this.updateSelectedItemId(id)}  />
      }
    ];

    //intitialisation state composant.
    this.state = {
      isError: false,
      isLoaded: false
    };
  }

  public componentDidMount() : void {
    this.setState({isLoaded: true});
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

        <HashRouter>
        <Pivot aria-label="Links of Large Tabs Pivot Example" 
          linkFormat={PivotLinkFormat.tabs} 
          linkSize={PivotLinkSize.large}>
            <PivotItem headerText={strings.HomeNav} itemKey={strings.HomeNav} itemProp="#/">
              <Redirect to="/" />
            </PivotItem>
            <PivotItem headerText={strings.NewEditNav} itemKey={strings.NewEditNav} itemProp="/Manage">
              <Redirect to="/Manage" />
            </PivotItem>
            <PivotItem headerText={strings.ArchiveNav} itemKey={strings.ArchiveNav} itemProp="/Archive">
              <Redirect to="/Archive" />
            </PivotItem>
        </Pivot>
        <Stack tokens={Consts.verticalGapStackTokens}>
          <StackItem>
            <Switch> {this.routes.map((route, i) => (
                  <Route index={i} path={route.path} exact={route.exact} component={route.component} />
                ))}
            </Switch>
          </StackItem>
        </Stack>
      </HashRouter>
    </div>
    );
  }

    /**
   * Dismiss message bar
   */
  private _dismissMessageBar = () => {
    this.setState({ isError: false });
  }

  //call back d'update de la selection 
  private updateSelectedItemId = (id: string): void => {
    this.setState({cultureSelected: id});
  }
}