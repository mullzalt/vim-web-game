import { Request, Response, NextFunction } from "express";
import { RequestError } from "../../utils/error";
import { signJwt, verifyJwt } from "../../utils/jwt";
import { findUniqueUser } from "../../services/user.service";
import config from "config";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../utils/cookie-options";

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh access token";

    if (!refresh_token) {
      return next(new RequestError(403, message));
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "refreshTokenPublicKey",
    );

    if (!decoded) {
      return next(new RequestError(403, message));
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: decoded.sub });

    if (!user) {
      return next(new RequestError(403, message));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("access_token_expires_in")}m`,
    });

    // 4. Add Cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...refreshTokenCookieOptions,
      httpOnly: false,
    });

    // 5. Send response
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
}
