import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

export const isRatelimitConfigured =
    typeof upstashUrl === "string" &&
    upstashUrl.startsWith("https://") &&
    typeof upstashToken === "string" &&
    upstashToken.length > 0

// 40 messages per hour per IP
export const chatRatelimit = isRatelimitConfigured
    ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(40, "1 h"),
          analytics: true,
          prefix: "ratelimit:chat"
      })
    : null