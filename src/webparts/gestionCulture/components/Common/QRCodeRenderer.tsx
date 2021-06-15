import * as React from "react";
import { IQRCodeProps } from "./IQRCodeProps";
import QRCode from 'qrcode';
import { IQRCodeStates } from "./IQRCodeStates";
import { Label } from "office-ui-fabric-react";


export default class QRCodeRenderer extends React.Component<IQRCodeProps, IQRCodeStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            imageGenerated:null,
            data: null
          };

          this.loadData = this.loadData.bind(this);
    }

    public componentDidMount() : void {
        let opts = {  
            errorCorrectionLevel: 'H',  
            type: 'image/jpeg',  
            rendererOpts: {  
                quality: 0.5  
            }
        };  

        this.loadData();
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                {this.props.itemId &&
                <div>
                    <Label>Lien de suivi de cette culture : </Label>
                    <img src={this.state.imageGenerated} /> 
                </div>
                }
            </div>
        );
    }

    private loadData() {
        this.props.suiviService.GetSpecificData(this.props.itemId.toString()).then((suivi) => {
            this.setState({ data: `${this.props.absoluteUrl}/Filter/Data:numero=${suivi}`});
            
            QRCode.toDataURL(this.state.data).then(url => {
            
                this.setState({imageGenerated: url});
            }); 
        });
     }
}