import * as React from "react";

// import { Carousel, CarouselButtonsDisplay, CarouselButtonsLocation, CarouselIndicatorShape } from "@pnp/spfx-controls-react/lib/Carousel";
import { CarouselRendererProps } from "./CarouselRendererProps";
import { ICarouselImageProps } from "@pnp/spfx-controls-react/lib/controls/carousel/CarouselImage";
import { CarouselRendererStates } from "./CarouselRendererStates";
//import styles from "../GestionCulture.module.scss";
import { Image, ImageFit } from "office-ui-fabric-react";


import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
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

     public render() {
        return (
            //   <Carousel
            //     buttonsLocation={CarouselButtonsLocation.center}
            //     buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
            //     contentContainerStyles={styles.carouselImageContent}
            //     isInfinite={true}
            //     indicatorShape={CarouselIndicatorShape.circle}
            //     slide={true}
            //     pauseOnHover={true}
            //     element={this.state.carouselItems}>
            //     </Carousel>
            <Carousel showArrows={false} showThumbs={false} width={400} dynamicHeight={true} className={styles.carouselImageContent}>
                {this.state.carouselItems.map((imageList) => {    
                  return (<div>
                      <img src={imageList.url} width={200}/>
                    <p className="legend">{imageList.title}</p>    
                  </div>);    
                })}    
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
                imageFit: ImageFit.contain
            }));

           this.setState({ carouselItems: items });
       });
    }
}