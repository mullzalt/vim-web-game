import { NextFunction, Response, Request } from "express";
import { prisma } from "../../utils/prisma";
import { RequestError } from "../../utils/error";
import { GameInput, ScoreInput } from "../../schemas/game.schema";
import { Prisma, User } from "@prisma/client";
import { count_paginate, paginate } from "../../utils/paginate";
import { GetQueryScema } from "../../schemas/url-query.schema";

async function GET(
  req: Request<{ gameId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId } = req.params;
    const scores = await prisma.score.findMany({
      where: {
        gameId,
      },
      orderBy: {
        totalScore: "desc",
      },
      take: 10,
      select: {
        id: true,
        totalScore: true,
        grade: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            Profile: {
              select: {
                photo: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: { rows: scores },
    });
  } catch (error) {
    next(error);
  }
}

async function POST(
  req: Request<{ gameId: string }, {}, ScoreInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = res.locals.user as User;
    const { gameId } = req.params;
    const { totalScore, times, keystrokes, grade } = req.body;
    let isPersonalBest = false;

    const prevScore = await prisma.score.findFirst({
      where: {
        gameId,
        userId: user.id,
      },
    });

    let gradeDiff = grade;

    const exp = Math.floor(totalScore / 10);

    if (prevScore) {
      gradeDiff =
        grade > prevScore.grade ? Math.abs(grade - prevScore.grade) : 0;
    }

    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        exp: {
          increment: exp,
        },
        totalScore: {
          increment: totalScore,
        },
        totalGrade: {
          increment: gradeDiff,
        },
      },
    });

    if (!prevScore) {
      await prisma.score.create({
        data: {
          gameId,
          userId: user.id,
          totalScore,
          times,
          keystrokes,
          grade,
        },
      });
      return res.status(200).json({
        status: "success",
        data: {
          prevBest: { times, keystrokes, totalScore, grade },
          current: { times, keystrokes, totalScore, grade },
          statsIncrease: {
            exp,
            totalScore: totalScore,
            totalGrade: gradeDiff,
          },
          isPersonalBest: true,
          isNew: true,
        },
      });
    }

    if (prevScore.totalScore < totalScore) {
      isPersonalBest = true;
      await prisma.score.update({
        where: { id: prevScore.id },
        data: {
          times,
          keystrokes,
          grade,
          totalScore,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        prevBest: prevScore,
        current: { times, keystrokes, totalScore, grade },
        statsIncrease: {
          exp,
          totalScore: totalScore,
          totalGrade: gradeDiff,
        },
        isPersonalBest,
        isNew: false,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  GET,
  POST,
};
