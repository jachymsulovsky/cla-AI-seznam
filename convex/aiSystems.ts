// @ts-ignore: Convex type definitions omit the mutation export in this package version.
import { mutation, query } from "convex/server";
import { verifyAdmin } from "./lib/verifyAdmin";

export const listAll = query(async ({ db }: any) => {
  const items = await db.query("aiSystems");
  return items.sort((a: any, b: any) => a._id.localeCompare(b._id));
});

export const add = mutation(async ({ db }: any, { token, ...system }: any) => {
  verifyAdmin(token);
  return await db.insert("aiSystems", system);
});

export const update = mutation(async ({ db }: any, { token, id, ...patch }: any) => {
  verifyAdmin(token);
  await db.patch(id, patch);
  return id;
});

export const remove = mutation(async ({ db }: any, { token, id }: { token: string; id: string }) => {
  verifyAdmin(token);
  await db.delete(id);
  return id;
});
