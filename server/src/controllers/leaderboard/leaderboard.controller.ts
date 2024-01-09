import { NextFunction, Response, Request } from "express";
import { prisma } from "../../utils/prisma";
import { GameInput } from "../../schemas/game.schema";
import { Prisma, User } from "@prisma/client";
import { count_paginate, paginate } from "../../utils/paginate";
import { GetQueryScema } from "../../schemas/url-query.schema";
import { RequestError } from "../../utils/error";

async function GET(
  req: Request<{}, {}, {}, GetQueryScema>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { page = "1", size = "50" } = req.query;

    const { take, skip, current_page } = paginate(Number(page), Number(size));

    const count = await prisma.profile.count({
      where: {
        totalGrade: {
          gt: 100,
        },
      },
    });
    const leaderboard = await prisma.profile.findMany({
      where: {
        totalGrade: {
          gt: 100,
        },
      },
      orderBy: {
        totalGrade: "desc",
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
        size: take,
        total_page,
        total_items,
        rows: leaderboard,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function GET_ME(
  req: Request<{}, {}, {}, GetQueryScema>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = res.locals;

    const me = await prisma.profile.findFirst({
      where: { userId: user.id },
    });

    if (!me) {
      return next(new RequestError(404, "Profile not found"));
    }

    if (me.totalGrade <= 100) {
      return res.status(200).json({
        status: "success",
        data: {
          ...me,
          rank: -1,
        },
      });
    }

    const count = await prisma.profile.count({
      where: {
        totalGrade: {
          gt: me.totalGrade,
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        ...me,
        rank: count + 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  GET,
  GET_ME,
};
