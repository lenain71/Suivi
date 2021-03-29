import React from "react";
import handleError from "../../../../Common/ErrorHandling/handleError";
import { Logger } from '@pnp/logging';
import { ILoadingState } from "./ILoadingState";
import { MessageBar, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react';

//import * as strings from 'GestionCultureWebPartStrings';

export abstract class LoadingComponent<P = {}, S extends ILoadingState = { isLoading: true, hasError: false, errorInfo: '' }, SS = any> extends React.Component<P, S, SS> 
{   
  constructor(props: P) {
    super(props);

    //set initial state
    this.state = {              
      ...this.state,
      isLoading: true,
      hasError: false,
      errorInfo: ''
    };  
  }

  protected async loadData(callback?: () => Promise<void>){   
    
    if (callback){
      try{
        await callback();
      }
      catch (error){
        debugger;
        this.setError(error);
        handleError(error);    
      }    
    }

    this.setState({
      isLoading: false
    });    
  }    

  protected renderLoading(): React.ReactElement<P>{
    return (
      <Spinner size={SpinnerSize.large} label={"test"} />
    );
  }

  public render(): React.ReactElement<P> {
           
    if (this.state.isLoading == true){
      return this.renderLoading();
    }

    if (this.state.hasError == true){            
      return this.renderErrors();
    }
    
    return this.innerRender();    
  }

  protected abstract innerRender(): React.ReactElement<P>;

  public componentDidCatch(error, errorInfo) {
    debugger;
    this.setError(error);
  }

  protected setError(error) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hasError: true,
      errorInfo: error.toString()
     });

     //Log
     Logger.error(error.toString());
  }

  protected clearError = () => {
    // TODO : prevent component rerender if error with loading data

    this.setState((prevState, props) => {
      return { ...prevState, errorInfo: '', hasError: false};
    });
  }

  protected renderErrors = () => {
    return (
      <div>
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={true}
          onDismiss={(ev) => this.clearError()}
        >
          {this.state.errorInfo}
        </MessageBar>
      </div>
    );
  }
}