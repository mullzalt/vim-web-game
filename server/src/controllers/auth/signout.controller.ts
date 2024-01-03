import { NextFunction, Request, Response } from "express";

export const signOutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.cookie("access_token", "", { maxAge: -1 });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });
    res.status(200).json({ status: "success" });
  } catch (err: any) {
    next(err);
  }
};
