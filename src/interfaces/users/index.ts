import { IGroupUser } from "../groupUser";

export interface IUserRequest {
  name: string;
  email: string;
  password: string;
  groupName: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  groupUser?: IGroupUser;
}

export interface IUserLogin {
  email: string;
  password: string;
}
