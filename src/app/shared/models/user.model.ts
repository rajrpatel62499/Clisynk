
interface User {
  _id: string;
  imageUrl: ImageUrl;
  addedBy: string[];
  isPasswordReset: boolean;
  roles: string[];
  countryCode: string;
  isBlocked: boolean;
  isDeleted: boolean;
  workspaceIds: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone1: string;
  name: string;
  fullName: string;
  superAdmin: boolean;
  phoneNumber: string;
  activeWorkspaceId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;


  displayedRoles?: [];
}

interface ImageUrl {
  original: string;
  thumbnail: string;
}