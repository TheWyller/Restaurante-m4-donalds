import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        isAdm: string;
        id: string;
      };
    }
  }
}
