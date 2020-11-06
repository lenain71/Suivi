import * as React from "react";
import { IconButton, ContextualMenuItemType } from "office-ui-fabric-react";
import styles from "../GestionCulture.module.scss";
import { IECBRendererProps } from "./IECBRendererProps";
import CreationRecolteDialog from "../Dialogs/RecolteDialog";

export class ECBRenderer extends React.Component<IECBRendererProps, {}> {

    private menuItem: Array<any>;

    public constructor(props: IECBRendererProps) {        
      super(props);
  
      this.state = {
        panelOpen: false
      };

      //initialisation menu item
      this.menuItem = [
        {
          key: this.props.archiveMode ? 'Voir' : 'Modifier',
          name: this.props.archiveMode ? 'Voir' : 'Modifier',
          iconProps:{iconName:'Edit'},
          onClick: this.handleClick.bind(this, this.props.item.Id)
        }];

      if(!this.props.archiveMode) {
        this.menuItem.push(
            {
              key: 'divider_1',
              itemType: ContextualMenuItemType.Divider
            },
            {
              key: 'Recolter',
              name: 'Recolter',
              iconProps:{iconName:'Accept'},
              onClick: this.handleRecolte.bind(this, this.props.item.Id)
            },
            {
              key: 'Supprimer',
              name: 'Supprimer',
              iconProps:{iconName:'Delete'},
              onClick: this.handleDelete.bind(this, this.props.item.Id)
            }
          );
      }
    }
  
    public render() {      
      return (
        <div>
          <IconButton id='ContextualMenuButton1'
                      text=''
                      width='30'
                      split={false}
                      iconProps={ { iconName: 'MoreVertical' } }
                      menuIconProps={ { iconName: '' } }
                      menuProps={{
                        shouldFocusOnMount: true,
                        items: this.menuItem
                      }} />
        </div>
      );
    }
  
    private handleClick(source:string, event) {
        this.props.redirect(source);
    }

    private handleDelete(source:string, event) {
        this.props.delete(source);
    }

    private handleRecolte(source: string,event) {
        //this.props.recolte(source);
        const dialog = new CreationRecolteDialog(this.props.suiviService,this.props.item);
        dialog.show().then(() => {
            this.props.recolte({return: dialog.result.status, error: dialog.result.error});
        }).catch((error) => {
            this.props.recolte({return: 'NOK', error: error});
        });
    }
  }