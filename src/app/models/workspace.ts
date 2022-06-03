
export interface Workspace {
  _id: string;
  description: string;
  isDeleted: boolean;
  name: string;
  addedBy: AddedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
  contacts: number;
}

interface AddedBy {
  _id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
}