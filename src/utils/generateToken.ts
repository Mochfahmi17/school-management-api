import jwt from "jsonwebtoken";

export default function generateToken(payload: object) {
  const secret = process.env.SECRET_KEY_TOKEN;
  if (!secret) {
    throw new Error("SECRET_KEY_TOKEN not found!");
  }

  const token = jwt.sign(payload, secret, { expiresIn: "24h" });

  return token;
}
