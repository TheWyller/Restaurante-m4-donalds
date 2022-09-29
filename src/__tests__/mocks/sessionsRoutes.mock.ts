import { IUserLogin, IUserRequest } from "../../interfaces/users";

export const mockedAdmin: IUserRequest = {
  name: "Felipe",
  email: "felipe@mail.com",
  password: "123456",
  groupName: "Administrador",
};

export const mockedAdminLogin: IUserLogin = {
  email: "root@root.com",
  password: "123456",
};

export const mockedUser: IUserRequest = {
  name: "kenzinho",
  email: "kenzinho@mail.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedUserLogin: IUserLogin = {
  email: "kenzinho@mail.com",
  password: "123456",
};
