import { Router } from "express";
import createTableController from "../controllers/tables/createTable.controller";
import deleteTableController from "../controllers/tables/deleteTable.controller";
import getTableByIdController from "../controllers/tables/getTableById.controller";
import listTableController from "../controllers/tables/listTable.controller";
import updateTableController from "../controllers/tables/updateTable.controller";

import authUserMiddleware from "../middlewares/authUser.middleware";
import isAdmCheckMiddleware from "../middlewares/isAdmCheck.middleware";

const routes = Router();

export const tablesRoutes = () => {
  routes.get("/", 
    authUserMiddleware, 
    listTableController
  );

  routes.get("/:id", 
    authUserMiddleware, 
    getTableByIdController
  );

  routes.post(
    "/",
    authUserMiddleware,
    isAdmCheckMiddleware,
    createTableController
  );
  
  routes.delete(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    deleteTableController
  );
  
  routes.patch(
    "/:id",
    authUserMiddleware,
    isAdmCheckMiddleware,
    updateTableController
  );
  
  return routes;
};
