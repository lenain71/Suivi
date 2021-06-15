import * as React from "react";
import { DialogContent, TextField, DialogFooter, Button, PrimaryButton, autobind, Dropdown, IDropdownOption } from "office-ui-fabric-react";
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import * as ReactDOM from "react-dom";
import * as strings from "GestionCultureWebPartStrings";
import { ISuiviService } from "../../../../Common/Contracts/ISuiviService";
import IGoToDialogContentProps from "./IGoToDialogContentProps";
import IGoToDialogContentStates from "./IGoToDialogContentStates";

class GoToDialogContent extends React.Component<IGoToDialogContentProps, IGoToDialogContentStates> {
    constructor(props) {
      super(props);
  
      this.state = {
          itemId: this.props.itemId,
          zipGrowID: null,
          zipGrowType: null,
          SerreType: null,
          isValidSelection: false,
          availableZipGrowList: []
      };

      this.selectZipGrow = this.selectZipGrow.bind(this);
    }

    public componentDidMount() : void {

        this.props.suiviService.GetZipGrowList(this.props.user).then((list) => {

            const result = [];

            list.map(data => {
                result.push({
                    key: data.MyFood_ZipGrowID,
                    value: data.MyFood_zipGrowType,
                    type: data.MyFood_SerreType,
                    text: `${data.MyFood_ZipGrowID} - ${data.MyFood_zipGrowType} - ${data.MyFood_SerreType}`
                });
            });

            //ajout du transfert en bac et aerospring
            result.push({
              key: 'Bac Perma',
              value: 'Bac Perma',
              type: 'Bac Perma',
              text: 'Bac Perma'
            });

            //ajout du transfert en bac et aerospring
            result.push({
              key: 'Aerospring',
              value: 'Aerospring',
              type: 'Aerospring',
              text: 'Aerospring'
            });

            //distinct
            this.setState({availableZipGrowList: result.filter((value, index, self) => self.map(x => x.key).indexOf(value.key) == index) });
        });
     }
  
    public render(): JSX.Element {   
        return (
          <DialogContent
            title={strings.GoToDialogTitle}
            onDismiss={this.props.close}
            showCloseButton={true}>
    
            <div id="divSelection">
            <Dropdown label={strings.GoToDialogSelect}
                placeholder={strings.GoToDialogSelect}
                options={this.state.availableZipGrowList}
                onChange={this.selectZipGrow} />
              <DialogFooter>
                <Button text='Annuler' title='Annuler' onClick={this.props.close} />
                <PrimaryButton text='Valider' disabled={!this.state.isValidSelection} title='Valider' onClick={() => { this.submit(this.state); }} />
              </DialogFooter>
            </div>
    
          </DialogContent>
        );
      }

    private selectZipGrow(event: React.FormEvent<HTMLDivElement>, item: any) : void {

        if(item)
        {
          if(item.key == 'Bac Perma' || item.key == 'Aerospring') { //cas particulier des bac perma/aerosrpring
            this.setState({isValidSelection: true, zipGrowID: item.key.toString(), zipGrowType: item.text, SerreType: item.type});
          }else {
            this.setState({isValidSelection: true, zipGrowID: item.key.toString(), zipGrowType: item.text.split(' - ')[1], SerreType: item.type});
          }
        }
        else {
            this.setState({isValidSelection: false});
        }
    }  

    private submit(state: IGoToDialogContentStates) {
      let request: any = {
        id: this.props.itemId,
        zipGrowID: state.zipGrowID,
        zipGrowType: state.zipGrowType,
        serreType: state.SerreType
      };
  
      this.props.submit(request);
    }
  }

  export interface IDialogResult {
    status: string;
    error: string;
  }
  
  
  export default class GoToDialog extends BaseDialog {
  
    private suiviService: ISuiviService;
    private itemId?: string;
    private user: string;

    public result: IDialogResult;
  
    constructor(suiviService: ISuiviService,user: string, itemId?: string) {
      super(); 
      this.suiviService = suiviService;
      this.itemId = itemId;
      this.user = user;
    }
  
    public render(): void {
      ReactDOM.render(<GoToDialogContent
        itemId={this.itemId}
        suiviService={this.suiviService}
        user={this.user}
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

        this.suiviService.TransfertTo(request.id.Id, request.zipGrowID, request.zipGrowType, request.serreType).then(() => {
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