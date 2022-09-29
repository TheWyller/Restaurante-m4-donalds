import { IUserLogin, IUserRequest } from "../../interfaces/users";

export const mockedNoAdmin: IUserRequest = {
  name: "default_user",
  email: "default@user.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedNoAdminLogin: IUserLogin = {
  email: "default@user.com",
  password: "123456",
};

export const mockedNewUser: IUserRequest = {
  name: "newbie",
  email: "newbie@newbie.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedUserToBeUpdate: IUserRequest = {
  name: "trainee",
  email: "trainee@trainee.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedUserToUpdate: IUserRequest = {
  name: "junior",
  email: "junior@junior.com",
  password: "123456",
  groupName: "Usuário",
};

export const mockedUserToDelete: IUserRequest = {
  name: "retired",
  email: "retired@retired.com",
  password: "123456",
  groupName: "Usuário",
};
