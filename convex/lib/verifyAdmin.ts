import jwt from "jsonwebtoken";

export function verifyAdmin(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Unauthorized");
  }
  const payload = jwt.verify(token, secret) as { role?: string };
  if (payload.role !== "admin") {
    throw new Error("Unauthorized");
  }
}
