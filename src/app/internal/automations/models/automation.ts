
export interface Automation {
    automationName: string;
    whenEvent: WhenEvent;
    thenEvents: ThenEvent[];
    addedBy: string;
    workspaceId: string;
    
    isDeleted?: boolean;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    deletedBy?: string;
  }
  
export interface WhenEvent {
    eventName: string;
    eventData: WhenEventData;
  }
  
export interface ThenEvent {
    eventData: ThenEventData;
    delayedOptions: DelayedOptions;
    isDelayed: boolean;
    _id: string;
    eventName: string;
  }
  
export interface DelayedOptions {
    dayInterval: DayInterval;
    timeInterval: TimeInterval;
    delayType: string;
  }
  
export interface TimeInterval {
    value: any[];
    intervalType: string;
  }
  
export interface DayInterval {
    intervalType: string;
    value: string;
  }
  
export interface ThenEventData {
    dataId: string;
    params: {
      thenTaskIndex?: number,
      emailData?: any,
    }
  }
  
export interface WhenEventData {
    dataId: string;
    params: {
      formTag?: string,
      name?: string,
      tagCategoryName?: string,
      price?: string,
    }
  }

export interface WhenThenEvent {
    eventDescription: string;
    eventName: string;
    img?: string;
}