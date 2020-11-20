import * as React from "react";
import { IGestionCultureStates } from "../IGestionCultureStates";
import { IStackStyles, IStackTokens, Layer, Spinner, SpinnerSize, Stack, StackItem } from "office-ui-fabric-react";
import { ListItemAttachments } from '@pnp/spfx-controls-react/lib/ListItemAttachments';
import {DetailListForm} from "neos-generic-components/lib/webparts/detailListForm/components/DetailListForm";
import styles from "../GestionCulture.module.scss";
import * as strings from "GestionCultureWebPartStrings";
import { IGestionCultureProps } from "../IGestionCultureProps";
import QRCodeRenderer from "../Common/QRCodeRenderer";
import { IFieldConfiguration } from "neos-generic-components/lib/webparts/detailListForm/components/IFieldConfiguration";
import { ControlMode } from "neos-generic-components/lib/common/datatypes/ControlMode";
import { CarouselRenderer } from "../Common/CarouselRenderer";

export default class NewEditData extends React.Component<IGestionCultureProps, IGestionCultureStates> {
    constructor(props: any) {
        super(props);

        //intitialisation state composant.
    this.state = {
        isError: false,
        isLoaded: false
      };
    }

    public componentDidMount() : void {
        this.setState({isLoaded: true});
    }

    public render(): React.ReactElement<any> {
      const stackStyles: IStackStyles = {
        root: {
          width: '100%',
        },
      };

      const wrapStackTokens: IStackTokens = {
         childrenGap: 30 
        };
      
        return (
          <div>
            {!this.state.isLoaded &&
              <Layer>
                <div className={styles.loaderRoot}>
                  <Spinner className={styles.loader} size={SpinnerSize.large} label={strings.Loading} />
                </div>
              </Layer>
            }
            <Stack>
                <StackItem> 
                    <DetailListForm 
                    title={this.props.title} 
                    webUrl={this.props.webUrl}
                    listUrl={this.props.listUrl}
                    id={Number(this.props.match.params.id != null ? this.props.match.params.id.split('=')[1] : this.props.itemId)}
                    formType={this.props.formType}
                    spHttpClient={this.props.httpClientContext}
                    webpartContext={this.props.webpartContext}
                    description={this.props.description}
                    fields={this.props.fields}
                    showUnsupportedFields={this.props.showUnsupportedFields}
                    onSubmitSucceeded={(id: number ) => this.props.onSubmitSucceeded(id)}
                    onUpdateFields={(fields: IFieldConfiguration[]) => this.props.onUpdateFields(fields)} />
                </StackItem>
               
                <StackItem>
                    {this.props.formType != ControlMode.New &&
                        <CarouselRenderer itemId={Number(this.props.match.params.id != null ? this.props.match.params.id.split('=')[1] : this.props.itemId)}
                         suiviService={this.props.suiviService} />
                }
                </StackItem>
            </Stack>
            <Stack>
            {/* <StackItem>
                    {this.props.formType != ControlMode.New && 
                        <ListItemAttachments listId={this.props.listId} itemId={Number(this.props.match.params.id != null ? this.props.match.params.id.split('=')[1] : this.props.itemId)}
                         context={this.props.webpartContext} openAttachmentsInNewWindow={true} />
                }
                </StackItem> */}
                <StackItem>
                    <QRCodeRenderer identifier={this.props.match.params.id != null ? this.props.match.params.id.split('=')[1] : this.props.itemId} absoluteUrl={this.props.absoluteApplicationUrl}></QRCodeRenderer>
                </StackItem>
            </Stack>
          </div>
        );
    }
}