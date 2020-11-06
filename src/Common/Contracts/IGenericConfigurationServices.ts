import GenericConfiguration from "../Entities/GenericConfiguration";

export interface IGenericConfigurationServices {
    getConfiguration(): Promise<GenericConfiguration>;
}