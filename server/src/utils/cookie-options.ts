import { CookieOptions } from "express";
import config from "config";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const ACCESS_EXPIRES = config.get<number>("access_token_expires_in");
const REFRESH_EXPIRES = config.get<number>("refresh_token_expires_in");

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + ACCESS_EXPIRES * 60 * 1000),
  maxAge: ACCESS_EXPIRES * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + REFRESH_EXPIRES * 60 * 1000),
  maxAge: REFRESH_EXPIRES * 60 * 1000,
};
