import { Router } from "express";
import createOrderController from "../controllers/order/createOrder.controller";
import deleteOrderController from "../controllers/order/deleteOrder.controller";
import listAOrderController from "../controllers/order/listAOrder.controller";
import listOrdersController from "../controllers/order/listOrders.controller";
import { listOrdersByUserIdController } from "../controllers/order/listOrdersByUserId.controller";
import updateOrderController from "../controllers/order/updateOrder.controller";
import createOrderProductController from "../controllers/orderProduct/createOrderProduct.controller";
import deleteOrderProductController from "../controllers/orderProduct/deleteOrderProduct.controller";

import authUserMiddleware from "../middlewares/authUser.middleware";
import isAdmCheckMiddleware from "../middlewares/isAdmCheck.middleware";

const routes = Router();

export const orderRoutes = () => {
  routes.get("/", 
    authUserMiddleware, 
    listOrdersController
  );

  routes.get("/:id", 
    authUserMiddleware, 
    listAOrderController
  );

  routes.get("/users/:id", 
    authUserMiddleware, 
    isAdmCheckMiddleware, 
    listOrdersByUserIdController
  );

  routes.post("/", 
    authUserMiddleware, 
    createOrderController
  );

  routes.post("/product", 
    authUserMiddleware, 
    createOrderProductController
  );

  routes.delete(
    "/product/:id",
    authUserMiddleware,
    deleteOrderProductController
  );

  routes.patch(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    updateOrderController
  );

  routes.delete(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    deleteOrderController
  );

  return routes;
};
