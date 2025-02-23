import dotenv from "dotenv";
dotenv.config();


export const config = {
    jwt: {
      secret: process.env.SECRET_KEY || "mon_super_secret", // Use a strong secret in production
      expiresIn: '1h', // Token expiration time
    },
  };