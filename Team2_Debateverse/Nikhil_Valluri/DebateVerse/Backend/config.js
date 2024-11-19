require("dotenv").config();
module.exports = {
          jwtSecret: process.env.JWT_SECRET ,
          dbUri: process.env.DATABASE_URL ,
          email: process.env.MAILER_EMAIL ,
          emailPassword: process.env.MAILER_PASSWORD,
        };
        