import * as React from "react";
import { DialogContent, TextField, DialogFooter, Button, PrimaryButton, MaskedTextField, autobind } from "office-ui-fabric-react";
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import * as ReactDOM from "react-dom";
import * as strings from "GestionCultureWebPartStrings";
import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";
import IRecolteDialogContentProps from "./IRecolteDialogContentProps";
import IRecolteDialogContentStates from "./IRecolteDialogContentStates";

class RecolteDialogContent extends React.Component<IRecolteDialogContentProps, IRecolteDialogContentStates> {

    constructor(props) {
      super(props);
  
      this.state = {
          itemId: this.props.itemId,
          comment: this.props.comment,
          weigth: this.props.weigth,
         isTextValid: false
      };
    }
  
    public render(): JSX.Element {

        const maskFormat: { [key: string]: RegExp } = {
            '*': /^[0-9]+$/,
          };
          
        return (
          <DialogContent
            title={strings.RecolteDialogTitle}
            onDismiss={this.props.close}
            showCloseButton={true}>
    
            <div id="divSelection">
            <TextField label={strings.RecolteDialogPoid} required={true} value={this.state.weigth} onChanged={(item) => this.maskedvalueTextChanged(`${item}`)} />
            <TextField label={strings.RecolteDialogComment} multiline rows={6} required={true} value={this.state.comment} onChanged={(item) => this.valueTextChanged(`${item}`)} />
              <DialogFooter>
                <Button text='Annuler' title='Annuler' onClick={this.props.close} />
                <PrimaryButton text='Valider' title='Valider' disabled={!this.state.isTextValid} onClick={() => { this.submit(this.state); }} />
              </DialogFooter>
            </div>
    
          </DialogContent>
        );
      }

      private maskedvalueTextChanged(newValue: any) {
        this.setState({weigth : newValue});
      } 

      private valueTextChanged(newValue: any) {
          this.setState({
              comment: newValue,
              isTextValid: (newValue != null && newValue.length > 0) ? true : false
          });
      }
    
    private submit(state: IRecolteDialogContentStates) {
      let request: any = {
        id: this.props.itemId,
        comment: state.comment,
        weigth: state.weigth
      };
  
      this.props.submit(request);
    }
  }

  export interface IDialogResult {
    status: string;
    error: string;
  }
  
  
  export default class CreationRecolteDialog extends BaseDialog {
  
    private suiviService: ISuiviService;
    private itemId?: string;

    public result: IDialogResult;
  
    constructor(suiviService: ISuiviService, itemId?: string) {
      super(); 
      this.suiviService = suiviService;
      this.itemId = itemId;
    }
  
    public render(): void {
      ReactDOM.render(<RecolteDialogContent
        comment=''
        weigth=''
        itemId={this.itemId}
        suiviService={this.suiviService}
        close={this.close}
        submit={this.submit}
      />, this.domElement);
    }
  
    public getConfig(): IDialogConfiguration {
      return {
        isBlocking: false
      };
    }
  
    @autobind
    private submit(request: any): void {  
        this.result = {status: '', error: ''};

        let _weigth = Number(request.weigth);
        if(_weigth === NaN) {
            _weigth = 0;
        }

        this.suiviService.RecolteData(request.id.ID, request.comment, _weigth).then(() => {
            this.result.status = "OK";
            this.close();
        }).catch((error) => {
            this.result.status="NOK";
            this.result.error = error.message;
            this.close();
        });
    }

    protected onAfterClose(): void {
        super.onAfterClose();

        this.result.status = "CANCEL";
        
        // Clean up the element for the next dialog
        ReactDOM.unmountComponentAtNode(this.domElement);
    }
  }