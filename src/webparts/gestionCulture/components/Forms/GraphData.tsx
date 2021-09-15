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
        isLoaded: true,
        charts: null
      };

      this.loadData = this.loadData.bind(this);
    }

    public componentDidMount() : void {
      this.loadData();
    }

    public componentDidUpdate() : void {
    }


    private loadData() : void {
      this.props.graphService.getAvailableZipGrowCount(this.props.webpartContext.pageContext.legacyPageContext["userId"]).then((data)=> {

        let chartData: Chart.ChartData;

        //labels
        let datalabels = ['Available Slot','Used Slot', 'Total number of ZipGrow'];
        let datatset: Chart.ChartDataSets[] = [];
        let obj;

        //datasets
        data.map((v,i) => {
          if(i == 0 ) {
            obj = {
              label: v.Category,
              data: [v.AvailableSlot,v.UsedSlot,v.TotalCount],
              fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // same color for all data elements
            borderColor: 'rgb(255, 99, 132)', // same color for all data elements
            borderWidth: 1
            };
          }
          else {
            obj = {
              label: v.Category,
              data: [v.AvailableSlot,v.UsedSlot,v.TotalCount],
              fill: false,
            backgroundColor: 'rgba(255, 159, 64, 0.2)', // same color for all data elements
            borderColor: 'rgb(255, 159, 64)', // same color for all data elements
            borderWidth: 1
            };
          }
         
          datatset.push(obj);
        });

        chartData = {
          labels: datalabels,
          datasets: datatset
        } ;

        this.setState({isError: false, isLoaded: true, charts: chartData});
       
      }).catch((error) => {
        this.setState({isError: true, isLoaded: true, error: error.toString()});
      });
    }

    public render(): React.ReactElement<any> {

       // set the options
       const options: Chart.ChartOptions = {
        scales:
        {
          yAxes:
            [
              {
                ticks:
                {
                  beginAtZero: true
                }
              }
            ]
        }
      };

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
                        data={this.state.charts}
                        options={options}
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