import * as React from "react";
import ImageMapper from 'react-image-mapper';
import styles from "../GestionCulture.module.scss";
import { IZipGrowStates } from "./IZipGrowStates";
import { IZipGrowProps } from "./IZipGrowProps";
import Area from "../../../../Common/Entities/Area";
import { ThemeSettingName } from "office-ui-fabric-react";

export default class ZipGrowMap extends React.Component<IZipGrowProps, IZipGrowStates> {

    private _imageUrl : string;
    private _map: any;


    constructor(props: any) {
        super(props);

        this._imageUrl = "https://neosideadesign.sharepoint.com/sites/MyFoodSuivi/SiteAssets/TestIARedim (5).jpg";
        this._map = {
            name: "myfood-city-map",
            areas: [
              { name: "1", shape: "poly", coords: [-3,73,340,73,627,3339,384,3422,279,3256], PreFillColor: "rgba(46,166,54,0.5)green"  },
              { name: "2", shape: "poly", coords: [920,86,1163,123,1274,3064,1080,3168,936,3037,771,145], FillColor: "pink"  },
              { name: "3", shape: "poly", coords: [1566,202,1749,207,1810,2830,1638,2902,1489,2803,1417,224], FillColor: "yellow"  },
              { name: "4", shape: "poly", coords: [2014,297,2174,314,2208,2611,2091,2672,1931,2589,1887,341], FillColor: "red"  },
              { name: "5", shape: "poly", coords: [6253,14,6004,3738,5540,3727,5662,9], FillColor: "red" },
              { name: "6", shape: "poly", coords: [5606,29,5518,3377,5297,3433,5164,3265,5164,18], FillColor: "red" },
              { name: "7", shape: "poly", coords: [5137,167,5120,2972,4976,3011,4915,2878,4943,167], FillColor: "red" },
              { name: "8", shape: "poly", coords: [4893,200,4893,2674,4788,2685,4744,2585,4733,343], FillColor: "red" },
              { name: "9", shape: "poly", coords: [4175,150,4164,2619,4015,2613,4020,145], FillColor: "red" },
              { name: "10", shape: "poly", coords: [3700,135,3722,180,3678,2477,3661,2615,3512,2554,3567,146], FillColor: "red" },
              { name: "11", shape: "poly", coords: [3302,154,3269,2418,3219,2528,3081,2517,3153,192], FillColor: "red" }
            ]
          };

        this.state = {
            hoveredArea : null
          };
    }

    public componentDidMount() : void {
    }

    public render(): React.ReactElement<any> {
        return (
            <div className={styles.zipMap}>
               <ImageMapper src={this._imageUrl} map={this._map} width={500} imgWidth={6256}
                    onLoad={this.load}
                    onClick={(area) => this.click(area)}
                    onMouseEnter={(area) => this.enterArea(area)}
                    onMouseLeave={(area) => this.leaveArea(area)}
                    onImageClick={(event) => this.clickOutSide(event)}
                    ></ImageMapper>
                <span className={styles.tooltip}
    	            style={{ ...this.getTipPosition(this.state.hoveredArea)}}>
    	        </span>
            </div>
        );
    }

    private load(): void {

    }

    private clickOutSide(event: any) : void {
        this.props.setFiltering(null);
    }

    private click(area: any) : void {
        this.setState({ hoveredArea: area });
        this.props.setFiltering(area.name);
    }

    private enterArea(area: any) : void {
        this.setState({ hoveredArea: area });
    }

    private leaveArea(area: any) : void {
        this.setState({ hoveredArea: null });
    }

    private getTipPosition(area: any) : any {
        /*if(area != null) {
            return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
        }*/
        
    }
}