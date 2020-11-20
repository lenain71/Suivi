import React from "react";
import ImageMapper from 'react-image-mapper';
import styles from "../GestionCulture.module.scss";
import { IZipGrowProps } from "./IZipGrowProps";
import { IZipGrowStates } from "./IZipGrowStates";

export default class SemisMap extends React.Component<IZipGrowProps, IZipGrowStates> {

    private _imageUrl : string;
    private _map: any;

    constructor(props: any) {
        super(props);

        this._imageUrl = "https://neosideadesign.sharepoint.com/sites/MyFoodSuivi/SiteAssets/semis.png";
        this._map = {
            name: "semis-map",
            areas: [
              { name: "ZoneTopUpLeft", shape: "rect", coords: [23,23,303,147], PreFillColor: "rgba(46,166,54,0.5)green"  },
              { name: "ZoneTopUpMiddle", shape: "rect", coords: [312,22,448,148], FillColor: "pink"  },
              { name: "zoneTopUpRight", shape: "rect", coords: [458,23,748,148], FillColor: "yellow"  },
              { name: "ZoneUpLeft", shape: "rect", coords: [20,155,375,216], FillColor: "red"  },
              { name: "ZoneUpRight", shape: "rect", coords: [387,155,746,216], FillColor: "red" },
              { name: "ZoneMiddleExtraLeft", shape: "rect", coords: [17,221,149,347], FillColor: "red" },
              { name: "ZoneMiddleLeft", shape: "rect", coords: [152,221,301,346], FillColor: "red" },
              { name: "ZoneMiddle", shape: "rect", coords: [314,221,448,347], FillColor: "red"},
              { name: "ZoneMiddleRight", shape: "rect", coords: [456,222,594,347], FillColor: "red"},
              { name: "ZoneMiddleExtraRight", shape: "rect", coords: [603,218,746,347], FillColor: "red"},
              { name: "ZoneDownLeft", shape: "rect",coords: [8,355,377,412], FillColor: "red"},
              { name: "ZoneDownRight", shape: "rect", coords: [387,354,748,414], FillColor: "red"},
              { name: "ZoneBottonDownExtraLeft", shape: "rect",coords: [8,416,149,542], FillColor: "red"},
              { name: "ZoneBottonDownLeft", shape: "rect", coords: [157,416,302,540], FillColor: "red"},
              { name: "ZoneBottonDownMiddle", shape: "rect", coords: [311,419,452,539], FillColor: "red"},
              { name: "ZoneBottonDownRight", shape: "rect", coords: [458,417,598,539], FillColor: "red"},
              { name: "ZoneBottonDownExtraRight", shape: "rect", coords: [605,418,749,541], FillColor: "red"}
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
               <ImageMapper src={this._imageUrl} map={this._map}
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

