declare interface IEnvironmentSettings {
    id: string;
    name: string;
    zip: string;
    apiResourceName:string;
    apiResourceScope: string;
}

declare module 'settings/environmentSettings' {
    const environmentSettings: IEnvironmentSettings;
    export = environmentSettings;
}