import { Request, Response } from "express";
import sessionLoginService from "../../services/session/loginSession.service";

const sessionLoginController = async (req: Request, res: Response) => {
  const userData = req.body;
  const token = await sessionLoginService(userData);

  return res.status(200).json({ token });
};

export default sessionLoginController;
