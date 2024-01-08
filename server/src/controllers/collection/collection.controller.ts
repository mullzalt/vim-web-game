import { NextFunction, Response, Request } from "express";
import { prisma } from "../../utils/prisma";
import { RequestError } from "../../utils/error";
import { GameInput } from "../../schemas/game.schema";
import { Prisma, User } from "@prisma/client";
import { count_paginate, paginate } from "../../utils/paginate";
import { GetQueryScema } from "../../schemas/url-query.schema";

async function GET_BY_ID(req: Request, res: Response, next: NextFunction) {}

async function PUT(
  req: Request<{ id: string }, {}, GameInput>,
  res: Response,
  next: NextFunction,
) {}

async function GET_TUTORIAL(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", size = "10" } = req.query;

    const { take, skip, current_page } = paginate(Number(page), Number(size));
    console.log({ take, skip, current_page });

    const count = await prisma.gameCollection.count({
      where: {
        isTutorial: true,
      },
    });
    const tutorial = await prisma.gameCollection.findMany({
      where: {
        isTutorial: true,
      },
      include: {
        Games: true,
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
        rows: tutorial,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function GET(
  req: Request<{}, {}, {}, GetQueryScema & { is_tutorial: boolean }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      page = 1,
      size = 10,
      orderBy = "createdAt",
      order = "desc",
    } = req.query;

    const { take, skip, current_page } = paginate(Number(page), Number(size));

    const count = await prisma.gameCollection.count();
    const collections = await prisma.gameCollection.findMany({
      include: {
        Games: true,
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
        rows: collections,
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
) {}

export default {
  GET,
  GET_TUTORIAL,
  GET_BY_ID,
  PUT,
  POST,
};
