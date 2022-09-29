import { Router } from "express";

import createCategoryController from "../controllers/category/createCategory.controller";
import listCategoryController from "../controllers/category/listCategory.controller";
import indexCategoryController from "../controllers/category/getCategoryById.controller";
import deleteCategoryController from "../controllers/category/deleteCategory.controller";
import updateCategoryController from "../controllers/category/updateCategory.controller";

import isAdmCheckMiddleware from "../middlewares/isAdmCheck.middleware";
import categoryAlreadyExistsMiddleware from "../middlewares/categoryAlreadyExists.middleware";
import categoryNotFoundMiddleware from "../middlewares/categoryNotFound.middleware";
import authUserMiddleware from "../middlewares/authUser.middleware";

const routes = Router();

export const categoryRoutes = () => {
  routes.post(
    "",
    authUserMiddleware,
    isAdmCheckMiddleware,
    categoryAlreadyExistsMiddleware,
    createCategoryController
  );

  routes.get("", listCategoryController);

  routes.get("/:id", categoryNotFoundMiddleware, indexCategoryController);

  routes.patch(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    categoryNotFoundMiddleware,
    categoryAlreadyExistsMiddleware,
    updateCategoryController
  );

  routes.delete(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    categoryNotFoundMiddleware,
    deleteCategoryController
  );

  return routes;
};
