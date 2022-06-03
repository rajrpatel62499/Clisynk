export interface User {
    _id: string;
    email: string;
    __v: number;
    createdAt: string;
    isBlocked: boolean;
    isDeleted: boolean;
    name: string;
    roles: string[];
    superAdmin: boolean;
    updatedAt: string;
    accessToken: string;
    countryCode: string;
    phoneNumber: string;
    profileImage: ProfileImage;
    address1: string;
    fullName: string;
    city: string;
    firstName: string;
    imageUrl: string;
    phone1Type: string;
    phone2Type: string;
    postalCode: string;
    state: string;
    title: string;
    phone1: string;
    phone2: string;
    website: string;
    deviceToken: string;
    lastName: string;
    activeWorkspaceId: string;
    workspaceIds: string[];
    company: string;
    introductionEmail: string;
    followupEmail: string;
  }
  
  interface ProfileImage {
    original: string;
    thumbnail: string;
  }