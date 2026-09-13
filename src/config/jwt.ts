import "dotenv/config";
import { SignOptions } from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error("JWT_SECRET_KEY no está configurada");
}

export const jwtConfig: {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
} = {
  secret: jwtSecretKey,
  expiresIn: (process.env.JWT_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
};