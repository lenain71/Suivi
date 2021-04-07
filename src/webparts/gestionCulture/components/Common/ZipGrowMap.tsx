import * as React from "react";
import ImageMapper from 'react-image-mapper';
import styles from "../GestionCulture.module.scss";
import { IZipGrowStates } from "./IZipGrowStates";
import { IZipGrowProps } from "./IZipGrowProps";
import { PnPClientStorage } from "@pnp/common";
import * as strings from "GestionCultureWebPartStrings";
import { Dropdown, IDropdownOption, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { dateAdd } from "@pnp/common";

export default class ZipGrowMap extends React.Component<IZipGrowProps, IZipGrowStates> {

    private _AllMap: any;
    private _pnpStorage: PnPClientStorage;

    constructor(props: any) {
        super(props);

        this._pnpStorage = new PnPClientStorage();

        this._AllMap = [
            {
                type: "city",
                name: "myfood-city-map",
                imageUrl: "https://neosideadesign.sharepoint.com/sites/MyFoodSuivi/SiteAssets/city.jpg",
                width: 500,
                imageWidth: 6256,
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
            },
            {
                type:"famillyOld",
                name: "myfood-familly-map",
                imageUrl:"https://neosideadesign.sharepoint.com/sites/MyFoodSuivi/SiteAssets/Familly.png",
                width: null,
                imageWidth: null,
                areas: [
                { name: "1", shape: "rect", coords: [20,31,71,81], PreFillColor: "rgba(46,166,54,0.5)green"  },
                { name: "2", shape: "rect", coords: [21,109,72,162], FillColor: "pink"  },
                { name: "3", shape: "rect", coords: [20,190,72,241], FillColor: "yellow"  },
                { name: "4", shape: "rect", coords: [20,269,71,321], FillColor: "red"  },
                { name: "5", shape: "rect", coords: [18,352,70,401], FillColor: "red" },
                { name: "6", shape: "rect", coords: [20,431,70,480], FillColor: "red" },
                { name: "7", shape: "rect", coords: [131,31,180,81], FillColor: "red" },
                { name: "8", shape: "rect", coords: [131,110,181,161], FillColor: "red" },
                { name: "9", shape: "rect", coords: [129,190,181,240], FillColor: "red" },
                { name: "10", shape: "rect", coords: [131,270,179,321], FillColor: "red" },
                { name: "11", shape: "rect", coords: [131,351,182,401], FillColor: "red" },
                { name: "12", shape: "rect", coords: [130,429,180,480], PreFillColor: "rgba(46,166,54,0.5)green"  },
                { name: "13", shape: "rect", coords: [270,30,320,82], FillColor: "pink"  },
                { name: "14", shape: "rect", coords: [271,111,321,161], FillColor: "yellow"  },
                { name: "15", shape: "rect", coords: [269,191,320,240], FillColor: "red"  },
                { name: "16", shape: "rect", coords: [269,270,320,320], FillColor: "red" },
                { name: "17", shape: "rect", coords: [271,350,321,401], FillColor: "red" },
                { name: "18", shape: "rect", coords: [270,431,320,481], FillColor: "red" },
                { name: "19", shape: "rect", coords: [379,31,430,80], FillColor: "red" },
                { name: "20", shape: "rect", coords: [379,111,431,159], FillColor: "red" },
                { name: "21", shape: "rect", coords: [380,191,430,241], FillColor: "red" },
                { name: "22", shape: "rect", coords: [382,271,430,320], FillColor: "red" },
                { name: "23", shape: "rect", coords: [381,350,430,400], FillColor: "red" },
                { name: "24", shape: "rect", coords: [379,430,430,480], FillColor: "red" }
                ]
            },
            {
                type:"familly",
                name: "myfood-familly-map",
                imageUrl:"https://neosideadesign.sharepoint.com/sites/MyFoodSuivi/SiteAssets/FamillyNew.png",
                width: null,
                imageWidth: null,
                areas: [
                    {name:"1", coords:[21,28,82,89], shape:"rect", FillColor: "red"},
                    {name:"2", coords:[22,111,82,172], shape:"rect", FillColor: "red"},
                    {name:"3", coords:[20,191,80,252], shape:"rect", FillColor: "red"},
                    {name:"4", coords:[21,273,82,333], shape:"rect", FillColor: "red"},
                    {name:"5", coords:[103,28,162,90], shape:"rect", FillColor: "red"},
                    {name:"6", coords:[103,111,161,171], shape:"rect", FillColor: "red"},
                    {name:"7", coords:[104,192,163,253], shape:"rect", FillColor: "red"},
                    {name:"8", coords:[102,274,163,335], shape:"rect", FillColor: "red"},
                    {name:"9", coords:[185,27,244,89], shape:"rect", FillColor: "red"},
                    {name:"10", coords:[182,110,246,171], shape:"rect", FillColor: "red"},
                    {name:"11", coords:[185,193,246,253], shape:"rect", FillColor: "red"},
                    {name:"12", coords:[182,272,245,334], shape:"rect", FillColor: "red"},
                    {name:"13", coords:[312,27,374,89], shape:"rect", FillColor: "red"},
                    {name:"14", coords:[313,111,373,171], shape:"rect", FillColor: "red"},
                    {name:"15", coords:[313,192,372,253], shape:"rect", FillColor: "red"},
                    {name:"16", coords:[311,274,373,335], shape:"rect", FillColor: "red"},
                    {name:"17", coords:[395,27,455,89], shape:"rect", FillColor: "red"},
                    {name:"18", coords:[395,110,456,171], shape:"rect", FillColor: "red"},
                    {name:"19", coords:[393,193,455,253], shape:"rect", FillColor: "red"},
                    {name:"20", coords:[395,272,456,335], shape:"rect", FillColor: "red"},
                    {name:"21", coords:[476,27,537,90], shape:"rect", FillColor: "red"},
                    {name:"22", coords:[474,109,538,172], shape:"rect", FillColor: "red"},
                    {name:"23", coords:[477,192,536,253], shape:"rect", FillColor: "red"},
                    {name:"24", coords:[476,272,536,334], shape:"rect", FillColor: "red"}
                ]
            }
        ];





        this.state = {
            hoveredArea : null,
            selectedMap: null,
            isConfigured: false
          };

          this.load = this.load.bind(this);
          this.selectConfiguration = this.selectConfiguration.bind(this);
    }

    public componentDidMount() : void {
        this.load();
    }

    public render(): React.ReactElement<any> {
        return (
            <div className={styles.zipMap}>
                { this.state.isConfigured &&
                <div>
                <ImageMapper src={this.state.selectedMap.imageUrl} map={this.state.selectedMap} 
                        width={this.state.selectedMap.width} 
                        imgWidth={this.state.selectedMap.imageWidth}
                        onClick={(area) => this.click(area)}
                        onMouseEnter={(area) => this.enterArea(area)}
                        onMouseLeave={(area) => this.leaveArea(area)}
                        onImageClick={(event) => this.clickOutSide(event)}
                        ></ImageMapper>
                    <span className={styles.tooltip}
                        style={{ ...this.getTipPosition(this.state.hoveredArea)}}>
                    </span>
                </div>
                }
                {!this.state.isConfigured && 
                <div>
                     <div>
                        <MessageBar messageBarType={MessageBarType.info}>
                            {strings.serreTypeTitle}
                        </MessageBar>
                    </div>
                    <div>
                    <Dropdown
                        placeholder={strings.serreTypeTitle}
                        options={[
                        { key: 'city', text: 'city' },
                        { key: 'familly', text: 'familly' },
                        { key: 'aerospring', text: 'aerospring', disabled: true }
                        ]}
                        required={true}
                        onChange={this.selectConfiguration} />
                   </div>
                </div>
                }
            </div>
        );
    }

    private load(): void {
        //vérification de la clé de configuration du type de map
      
        const paramTypeMap = this._pnpStorage.local.get("myfood:map");

        //récupration de la clé et binding en fonction de la configuration
        if(paramTypeMap != null) {
            this.setState({isConfigured: true, selectedMap: this._AllMap.find(i => i.type == paramTypeMap)});
        }
        else { //display configuration
            this.setState({isConfigured: false});
        }
    }

    private selectConfiguration (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) : void {

        if(item)
        {
            //enregistrement de la clé de configuration du type de map
            this._pnpStorage.local.put("myfood:map",item.key.toString(), dateAdd(new Date(),'year',1));

            this.load();
        }
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