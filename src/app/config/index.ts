import dotenv from 'dotenv';
import path from "path"
dotenv.config({ path: path.join((process.cwd(), '.env')) });
export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_reset_expire_in:process.env.JWT_RESET_EXPIRES_IN,
    reset_pass_ui_link:process.env.RESET_PASS_UI_LINK,
    nodemailer_email:process.env.NODEMAILER_EMAIL,
    nodemailer_app_pass:process.env.NODEMAILER_APP_PASS
  };
  