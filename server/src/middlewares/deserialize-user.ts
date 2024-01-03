import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { RequestError } from "../utils/error";
import { verifyJwt } from "../utils/jwt";
import { findUniqueUser } from "../services/user.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new RequestError(401, "You are not logged in"));
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey",
    );

    if (!decoded) {
      return next(new RequestError(401, `Invalid token or user doesn't exist`));
    }

    if (!decoded) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token or user doesn't exist",
      });
    }

    const user = await findUniqueUser({ id: decoded.sub });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token or session has expired",
      });
    }

    res.locals.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};
