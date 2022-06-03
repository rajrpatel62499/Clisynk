export interface Tag {
  _id: string;
  description: string;
  name: string;
  tagCategoryId: TagCategory;
  tagId: number;
}

export interface TagCategory {
  _id: string;
  name: string;
}