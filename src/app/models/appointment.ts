export interface Appointment {
    availability: Availability[];
    isBlocked: boolean;
    isDeleted: boolean;
    _id: string;
    name: string;
    location: Location;
    addedBy: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    afterBufferTime: number;
    beforeBufferTime: number;
    duration: number;
  }
  
  interface Location {
    type: number;
    radioSelected: string;
  }
  
  interface Availability {
    day: string;
    timings: Timing[];
    active?: boolean;
  }
  
  interface Timing {
    start: string;
    end: string;
  }