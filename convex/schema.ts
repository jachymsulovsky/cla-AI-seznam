// @ts-ignore: Convex package type exports are incomplete in this version.
import { defineSchema, defineTable, v } from "convex/schema";

export default defineSchema({
  aiSystems: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    url: v.optional(v.string()),
    provider: v.optional(v.string()),
    status: v.union(v.literal("approved"), v.literal("restricted")),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),
});
