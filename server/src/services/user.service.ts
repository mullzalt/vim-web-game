import { Prisma, User } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { signJwt } from "../utils/jwt";
import config from "config";

export const excludedUserFields = ["password"];

export async function findUniqueUser(where: Prisma.UserWhereUniqueInput) {
  return await prisma.user.findUnique({
    where,
    select: {
      id: true,
      email: true,
      Profile: true,
      role: true,
    },
  });
}

export async function signTokens(user: Prisma.UserCreateInput) {
  const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<string>("access_token_expires_in")}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<string>("refresh_token_expires_in")}m`,
  });

  return { access_token, refresh_token };
}
