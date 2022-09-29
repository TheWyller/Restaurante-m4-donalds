import { Router } from "express";
import deleteUserController from "../controllers/users/deleteUser.controller";
import userListController from "../controllers/users/listUser.controller";
import createUserController from "../controllers/users/createUser.controller";
import { getUserByIdController } from "../controllers/users/getUserById.controller";
import updateUserController from "../controllers/users/updateUser.controller";

import emailCheckMiddle from "../middlewares/emailCheck.middleware";
import authUserMiddleware from "../middlewares/authUser.middleware";
import isAdmCheckMiddleware from "../middlewares/isAdmCheck.middleware";
import idCheckMiddle from "../middlewares/idCheck.middleware";

const routes = Router();

export const userRoutes = () => {
  routes.get("/", authUserMiddleware, isAdmCheckMiddleware, userListController);

  routes.get(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    getUserByIdController
  );

  routes.delete(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    deleteUserController
  );

  routes.post(
    "/",
    authUserMiddleware,
    isAdmCheckMiddleware,
    emailCheckMiddle,
    createUserController
  );

  routes.patch(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    idCheckMiddle,
    emailCheckMiddle,
    updateUserController
  );

  return routes;
};
