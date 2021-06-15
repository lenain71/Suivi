import { Layer, MessageBar, MessageBarType, Spinner, SpinnerSize, Stack, StackItem } from "office-ui-fabric-react";
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import React from "react";
import Consts from "../../../../Common/Constants";
import { IGraphDataProps } from "./IGraphDataProps";
import { IGraphDataStates } from "./IGraphDataStates";

import * as strings from "GestionCultureWebPartStrings";
import styles from "../GestionCulture.module.scss";

export default class GraphData extends React.Component<IGraphDataProps, IGraphDataStates> {
    constructor(props: any) {
        super(props);

        //intitialisation state composant.
    this.state = {
        error: '',
        isError: false,
        isLoaded: false
      };
    }

    public componentDidMount() : void {

       //this.loadData();
    }

    private loadData(): void {
        throw new Error("Method not implemented.");
    }

    public componentDidUpdate() : void {
    }

    private _loadAsyncData(): Promise<Chart.ChartData> {

       this.props.graphService.getAvailableZipGrowCount(this.props.webpartContext.pageContext.legacyPageContext["userId"]).then((data)=> {

        console.log(data);
       
      }).catch((error) => {
        this.setState({isError: true, isLoaded: true, error: error.toString()});
      });
        return new Promise<Chart.ChartData>((resolve, reject) => {
          // Call your own service -- this example returns an array of numbers
          // but you could call
        //   const dataProvider: IChartDataProvider = new MockChartDataProvider();
        //   dataProvider.getNumberArray().then((numbers: number[]) => {
            // format your response to ChartData
            const data: Chart.ChartData =
            {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  data: [8, 12, 14, 18, 25]
                }
              ]
            };
    
            // resolve the promise
            resolve(data);
          });
      }

    public render(): React.ReactElement<any> {
        return (
            <div>
              { this.renderErrors() }
  
              {!this.state.isLoaded &&
                <Layer>
                  <div className={styles.loaderRoot}>
                    <Spinner className={styles.loader} size={SpinnerSize.large} label={strings.Loading} />
                  </div>
                </Layer>
              }
              <Stack tokens={Consts.verticalGapStackTokens}>
                  <StackItem>
                  <ChartControl
                        type='bar'
                        datapromise={this._loadAsyncData()}
                        loadingtemplate={() => <Spinner size={SpinnerSize.large} label={strings.Loading}  />}
                        rejectedtemplate={(error: string) => <div>Something went wrong: {error}</div>}/>
                  </StackItem>
                  {/* <StackItem>
                      <SearchBox placeholder={strings.SearchPlaceHolder} value={this.state.searchValue} iconProps={{iconName: 'Filter'}} 
                      onClear={this.loadData}
                      onChange={(newValue) => this.SearchData(newValue)}
                      onSearch={(newValue) => this.SearchData(newValue)} />
                  </StackItem> */}
              </Stack>
            </div>
          );
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

    private clearError() {
        this.setState( (prevState, props) => {
          return {...prevState, error: '', isError: false};
        } );
    }
}