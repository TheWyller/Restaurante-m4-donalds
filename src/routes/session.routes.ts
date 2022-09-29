import { Router } from "express";

import sessionLoginController from "../controllers/sessions/loginSession.controller";

const routes = Router();

export const sessionRoutes = () => {
  routes.post("", sessionLoginController);
  return routes;
};
