import { cleanEnv, port, str, url } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    DATABASE_URL: url(),

    GOOGLE_OAUTH_CLIENT_ID: str(),
    GOOGLE_OAUTH_CLIENT_SECRET: str(),
    GOOGLE_OAUTH_REDIRECT: url(),

    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),

    ORIGIN: url(),
  });
}

export default validateEnv;
