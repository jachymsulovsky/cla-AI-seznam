"use node";

import jwt from "jsonwebtoken";
// @ts-ignore: Convex type definitions omit the action export in this package version.
import { action, ConvexError } from "convex/server";

const ADMIN_LOGIN = process.env.ADMIN_LOGIN ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ModreNebe1";

export const adminLogin = action(async ({}, { login, password }: { login: string; password: string }) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new ConvexError("Nesprávné přihlašovací údaje");
  }

  if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
    throw new ConvexError("Nesprávné přihlašovací údaje");
  }

  return jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });
});
