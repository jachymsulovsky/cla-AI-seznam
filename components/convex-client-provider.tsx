"use client";

import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexAddress = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:8090";
const convexClient = new ConvexReactClient({ address: convexAddress });

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
