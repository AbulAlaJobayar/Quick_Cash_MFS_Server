declare namespace NodeJS {
  export type ProcessEnv = {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    BCRYPT_SALT_ROUNDS: number;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    JWT_RESET_EXPIRES_IN:string;
    RESET_PASS_UI_LINK:string;
    NODEMAILER_EMAIL:string;
    NODEMAILER_APP_PASS:string;
  };
}
