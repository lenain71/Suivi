import * as React from "react";
import { Stack, Icon, Image, Text, IStackTokens, ITextStyles, FontWeights, IIconStyles } from "office-ui-fabric-react";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import { IResumeConfigurationProps } from "./IResumeConfigurationProps";

export default class ResumeConfiguration extends React.Component<IResumeConfigurationProps, {}> {

  private siteTextStyles: ITextStyles = {
    root: {
      color: '#025F52',
      fontWeight: FontWeights.semibold,
    },
  };
  private descriptionTextStyles: ITextStyles = {
    root: {
      color: '#333333',
      fontWeight: FontWeights.regular,
    },
  };
  private helpfulTextStyles: ITextStyles = {
    root: {
      color: '#333333',
      fontWeight: FontWeights.regular,
    },
  };

  private footerCardSectionStyles: ICardSectionStyles = {
    root: {
      alignSelf: 'stretch',
      borderLeft: '1px solid #F3F2F1',
    },
  };

  private cardTokens: ICardTokens = { childrenMargin: 12 };

    constructor(props: any) {
        super(props);
    }

    public componentDidMount() : void {
    }

    public render(): React.ReactElement<any> {  
        return (
                <Card aria-label="Information général" horizontal tokens={this.cardTokens}>
                    <Card.Item fill>
                        <Image width={180} height={135} src={
                          (this.props.dataContext.picturePath != null && this.props.myfoodhub_ImageUrl !=null) ? `${this.props.dataContext.picturePath}`  :
                           ((this.props.dataContext.picturePath != null && this.props.myfoodhub_ImageUrl !=null)  ? `${this.props.myfoodhub_ImageUrl}/${this.props.dataContext.productionUnitTypeImage}` : 'https://placehold.it/180x135' )} alt="Placeholder image." />
                    </Card.Item>
                    <Card.Section>
                        <Text variant="small" styles={this.siteTextStyles}>
                            {`${this.props.dataContext.pioneerCitizenName} - ${this.props.dataContext.pioneerCitizenNumber}`}
                        </Text>
                        <Text styles={this.descriptionTextStyles}>
                            {`${this.props.dataContext.productionUnitTypeName} - ${this.props.dataContext.productionUnitInfo}`}
                        </Text>
                        <Text variant="small" styles={this.helpfulTextStyles}>
                            {`Statut : ${this.props.dataContext.productionUnitStatus}`}
                        </Text>
                        <Text variant="small" styles={this.helpfulTextStyles}>
                            {`Localisation : ${this.props.dataContext.location}`}
                        </Text>
                    </Card.Section>
                    <Card.Section>
                      <Text variant="small" styles={this.helpfulTextStyles}>
                        {`Options: ${this.props.dataContext.productionUnitOptions}`}
                      </Text>
                    </Card.Section>
                    {/* { this.renderOption() } */}
                </Card>
        );
    }

    // private renderOption() {
    //   if(this.props.dataContext.productionUnitOptions.length > 0)
    //   {
    //       return  <Card.Section>
    //       {
    //           this.props.dataContext.options.map( (item) =>
    //           <Text variant="small" styles={this.helpfulTextStyles}>
    //                         {`Option : ${item.name}`}
    //                     </Text>
    //           )
    //       }
    //       </Card.Section>;
    //   }
  //}
}