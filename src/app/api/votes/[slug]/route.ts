import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 30;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "Voting is not configured" },
      { status: 503 }
    );
  }

  const { slug } = await params;
  const body = await request.json();
  const action = body.action as string;

  if (action !== "upvote" && action !== "remove") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateLimitKey = `ratelimit:votes:${ip}`;
  const currentCount = (await redis.get<number>(rateLimitKey)) ?? 0;

  if (currentCount >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const pipeline = redis.pipeline();
  pipeline.incr(rateLimitKey);
  if (currentCount === 0) {
    pipeline.expire(rateLimitKey, RATE_LIMIT_WINDOW);
  }

  if (action === "upvote") {
    pipeline.hincrby("shader:votes", slug, 1);
  } else {
    const currentVotes =
      (await redis.hget<number>("shader:votes", slug)) ?? 0;
    if (currentVotes > 0) {
      pipeline.hincrby("shader:votes", slug, -1);
    }
  }

  await pipeline.exec();

  const newCount = (await redis.hget<number>("shader:votes", slug)) ?? 0;
  return NextResponse.json({ votes: newCount });
}
