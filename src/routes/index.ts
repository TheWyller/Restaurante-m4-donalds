import { Express } from "express";
import { sessionRoutes } from "./session.routes";
import { userRoutes } from "./user.routes";
import { categoryRoutes } from "./category.routes";
import { tablesRoutes } from "./tables.routes";
import { orderRoutes } from "./order.routes";
import { productRoutes } from "./products.routes";


export const appRoutes = (app: Express) => {
  app.use("/login", sessionRoutes());
  app.use("/users", userRoutes());
  app.use("/categories", categoryRoutes());
  app.use("/tables", tablesRoutes());
  app.use("/orders", orderRoutes());
  app.use("/products", productRoutes())
};
