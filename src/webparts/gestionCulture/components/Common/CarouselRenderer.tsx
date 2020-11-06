import * as React from "react";

import { Carousel, CarouselButtonsDisplay, CarouselButtonsLocation, CarouselIndicatorShape } from "@pnp/spfx-controls-react/lib/Carousel";
import { CarouselRendererProps } from "./CarouselRendererProps";
import { ICarouselImageProps } from "@pnp/spfx-controls-react/lib/controls/carousel/CarouselImage";
import { CarouselRendererStates } from "./CarouselRendererStates";
import styles from "../GestionCulture.module.scss";

export class CarouselRenderer extends  React.Component<CarouselRendererProps, CarouselRendererStates> {
    public constructor(props: CarouselRendererProps) {        
        super(props);

        this.state = {
            carouselItems:[]
          };

        this.loadData = this.loadData.bind(this);
    }

    public componentDidMount() : void {
        this.loadData();
    }

     public render(): React.ReactElement<any> {
        return (
              <Carousel
                buttonsLocation={CarouselButtonsLocation.center}
                buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
                contentContainerStyles={styles.carouselImageContent}
                isInfinite={true}
                indicatorShape={CarouselIndicatorShape.circle}
                slide={true}
                pauseOnHover={true}
                element={this.state.carouselItems}>
                </Carousel>
        );
    }

    private loadData() {
       this.props.suiviService.GetAttachmentForSuivi(this.props.itemId.toString()).then((data) => {

        let items = new Array<ICarouselImageProps>();

        data.map(val => items.push({
                imageSrc: val.Url,
                title: val.Title,
                description: val.Description,
                url: val.Url,
                showDetailsOnHover: val.ShowDetail,
            }));

           this.setState({ carouselItems: items });
       });
    }
}