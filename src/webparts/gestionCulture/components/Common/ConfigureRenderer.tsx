import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import React from "react";

import * as strings from "GestionCultureWebPartStrings";

export class ConfigureRenderer extends  React.Component {

     public render() {
        return (
            <div>
                <MessageBar messageBarType={MessageBarType.warning} >
                    {strings.HubErrorMessage}
                </MessageBar>
            </div>
        );
    }
}