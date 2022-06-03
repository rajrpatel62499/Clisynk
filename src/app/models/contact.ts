export interface Contact {
  data: ContactData[];
  todayCount: number;
  totalCount: number;
  leads: number;
  clients: number;
  manger: number;
}

export interface ContactData {
  _id: string;
  imageUrl: ImageUrl;
  contactsType: number;
  tagIds: string[];
  countryCode: string;
  addedBy: string[];
  isBlocked: boolean;
  isDeleted: boolean;
  deviceToken: string;
  workspaceIds: string[];
  firstName: string;
  lastName: string;
  email: string;
  multiPhoneNumber: MultiPhoneNumber[];
  fullName: string;
  personalEmail: string;
  otherEmail: string;
  phoneNumber: string;
  activeWorkspaceId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  
  isSelected?: any;
}

interface MultiPhoneNumber {
  _id: string;
  phoneNumber: string;
  type: string;
}

interface ImageUrl {
  original: string;
  thumbnail: string;
}