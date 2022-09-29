import { Router } from "express";

import createProductController from "../controllers/product/createProduct.controller";
import deleteProductController from "../controllers/product/deleteProduct.controller";
import { getProductByIdController } from "../controllers/product/getProductById.controller";
import listProductController from "../controllers/product/listProduct.controller";
import updateProductController from "../controllers/product/updateProduct.controller";

import authUserMiddleware from "../middlewares/authUser.middleware";
import isAdmCheckMiddleware from "../middlewares/isAdmCheck.middleware";

const routes = Router();

export const productRoutes = () => {
  routes.get("/", authUserMiddleware, listProductController);

  routes.get("/:id", authUserMiddleware, getProductByIdController);

  routes.post(
    "/",
    authUserMiddleware,
    isAdmCheckMiddleware,
    createProductController
  );

  routes.delete(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    deleteProductController
  );

  routes.patch(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    updateProductController
  );

  return routes;
};
