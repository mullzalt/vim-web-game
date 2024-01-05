import { NextFunction, Response, Request } from "express";
import { prisma } from "../../utils/prisma";
import { RequestError } from "../../utils/error";
import { GameInput } from "../../schemas/game.schema";
import { Prisma, User } from "@prisma/client";
import { count_paginate, paginate } from "../../utils/paginate";

async function GET_BY_ID(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            role: true,
            Profile: true,
          },
        },
      },
    });

    if (!game) {
      return next(new RequestError(404, "Game module not found."));
    }

    return res.status(200).json({
      status: "success",
      data: game,
    });
  } catch (error) {
    next(error);
  }
}

async function PUT(
  req: Request<{ id: string }, {}, GameInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const {
      title,
      shortDesc,
      lang,
      actions,
      desc,
      initialCode,
      intendedKeystrokes,
    } = req.body;

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        shortDesc,
        lang,
        actions,
        desc,
        initialCode,
        intendedKeystrokes,
      },
    });

    if (!game) {
      return next(new RequestError(404, "Game module not found."));
    }

    return res.status(200).json({
      status: "success",
      data: game,
    });
  } catch (error) {
    next(error);
  }
}

async function GET(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, size, show_archived } = req.query;

    const { take, skip, current_page } = paginate(
      page as string,
      size as string,
    );

    const where = JSON.parse((show_archived as string) || "false")
      ? {}
      : { archived: false };

    const count = await prisma.game.count({ where });
    const game = await prisma.game.findMany({
      where,
      include: {
        creator: {
          select: {
            role: true,
            Profile: true,
          },
        },
      },

      take,
      skip,
    });

    const { total_items, total_page } = count_paginate({
      take,
      count,
    });

    return res.status(200).json({
      status: "success",
      data: {
        current_page,
        total_page,
        total_items,
        rows: game,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function POST(
  req: Request<{}, {}, GameInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = res.locals.user as User;

    const game = await prisma.game.create({
      data: {
        ...req.body,
        favoriteCount: 0,
        playCount: 0,
        createdBy: user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      data: game,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  GET,
  GET_BY_ID,
  PUT,
  POST,
};
