import * as React from "react";
import { IQRCodeProps } from "./IQRCodeProps";
import QRCode from 'qrcode';
import { IQRCodeStates } from "./IQRCodeStates";
import { Stack, StackItem, Label } from "office-ui-fabric-react";


export default class QRCodeRenderer extends React.Component<IQRCodeProps, IQRCodeStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            imageGenerated:null
          };
    }

    public componentDidMount() : void {
        let opts = {  
            errorCorrectionLevel: 'H',  
            type: 'image/jpeg',  
            rendererOpts: {  
                quality: 0.5  
            }
        };  
        
        QRCode.toDataURL(window.location.href.toString(), opts).then(url => {
            
            this.setState({imageGenerated: url});
        }); 
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                {this.props.identifier &&
                <div>
                    <Label>Lien de suivi de cette culture : </Label>
                    <img src={this.state.imageGenerated} /> 
                </div>
                }
            </div>
        );
    }
}