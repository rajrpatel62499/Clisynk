
//   interface Datum2 {
//     _id: string;
//     data: Datum[];
//   }
  
export interface Task {
    _id: string;
    isReminder: boolean;
    isReminderDone: boolean;
    status: number;
    isBlocked: boolean;
    isDeleted: boolean;
    contactId: ContactId;
    note: string;
    title: string;
    dueDateTime: number;
    reminderType: number;
    timeZone: number;
    addedBy: AddedBy;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    convertedDate: string;
    date: string;
    /* New added */
    startDateTime: number;
    priority: string;
    image: string;

  }
  
  interface AddedBy {
    _id: string;
    name: string;
  }
  
  interface ContactId {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  }