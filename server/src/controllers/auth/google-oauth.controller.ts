import { NextFunction, Request, Response } from "express";
import {
  getGoogleOauthToken,
  getGoogleUser,
} from "../../services/session.service";
import { prisma } from "../../utils/prisma";

import config from "config";

import { signTokens } from "../../services/user.service";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../utils/cookie-options";

export const googleOauthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ORIGIN = config.get<string>("origin");

  try {
    const code = req.query.code as string;
    const pathUrl = (req.query.state as string) || "/";

    if (!code) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization code not provided!",
      });
    }

    const { id_token, access_token: google_access_token } =
      await getGoogleOauthToken({ code });

    const {
      verified_email,
      email,
      picture,
      id: google_account_id,
    } = await getGoogleUser({
      id_token,
      access_token: google_access_token,
    });

    if (!verified_email) {
      return res.status(403).json({
        status: "fail",
        message: "Google account not verified",
      });
    }

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
      },
      update: {},
    });

    if (!user) {
      return res.redirect(`${ORIGIN}/oauth`);
    }

    const count = await prisma.user.count();

    const account_profile = await prisma.user.update({
      where: { email },
      data: {
        Accounts: {
          upsert: {
            where: { providerAccountId: google_account_id },
            create: {
              provider: "Google",
              providerAccountId: google_account_id,
            },
            update: {},
          },
        },
        Profile: {
          upsert: {
            where: { userId: user.id },
            create: {
              username: `user-${count}`,
              photo: picture,
              exp: 0,
              totalGrade: 0,
              totalScore: 0,
            },
            update: {},
          },
        },
      },
    });

    if (!account_profile) {
      return res.redirect(`${ORIGIN}/oauth/error`);
    }

    const { access_token, refresh_token } = await signTokens(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...refreshTokenCookieOptions,
      httpOnly: false,
    });

    res.redirect(`${ORIGIN}${pathUrl}`);
  } catch (err: any) {
    console.log("Failed to authorize Google User", err);
    return res.redirect(`${ORIGIN}/oauth/error`);
  }
};
