import { NextFunction, Response, Request } from "express";
import { prisma } from "../../utils/prisma";
import { RequestError } from "../../utils/error";
import { GameInput } from "../../schemas/game.schema";
import { Prisma, User } from "@prisma/client";

function paginate(page: string = "1", size: string = "10") {
  const _page = Math.max(1, parseInt(page as string));
  const _size = Math.max(1, parseInt(size as string));
  const skip = (_page - 1) * _size;
  const take = _size;

  return {
    skip,
    take,
    current_page: _page,
  };
}

function count_paginate({ take, count }: { take: number; count: number }) {
  return {
    total_items: count,
    total_page: Math.ceil(count / take),
  };
}

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
      data: game,
      current_page,
      total_page,
      total_items,
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

    const body = req.body;

    const game = await prisma.game.create({
      data: {
        title: body.title,
        favoriteCount: 0,
        shortDesc: body.short_desc,
        desc: body.desc,
        initialCode: body.initial_code,
        playCount: 0,
        actions: body.actions,
        intendedKeystrokes: body.intended_keystrokes || 0,
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
  POST,
};
