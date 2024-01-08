import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { RequestError } from "../../utils/error";

export const updateUsernameHandler = async (
  req: Request<{}, {}, { username: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    const { username } = req.body;

    const existingUsername = await prisma.profile.findFirst({
      where: {
        username,
      },
    });

    if (existingUsername) {
      next(new RequestError(409, "Username already taken!"));
    }

    const update = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        username,
      },
    });

    return res.status(200).json({
      status: "success",
      data: update,
    });
  } catch (err: any) {
    next(err);
  }
};
