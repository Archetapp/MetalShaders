import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({});
  }

  const votes =
    (await redis.hgetall<Record<string, number>>("shader:votes")) ?? {};
  return NextResponse.json(votes);
}
