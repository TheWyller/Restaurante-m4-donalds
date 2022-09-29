import { IUserLogin, IUserRequest } from "../../interfaces/users";

export const mockedAdminRootLogin: IUserLogin = {
  email: "root@root.com",
  password: "123456",
};

export const mockedUser: IUserRequest = {
  name: "Wyller",
  email: "wyller@mail.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedUserLogin: IUserLogin = {
  email: "wyller@mail.com",
  password: "123456",
};
