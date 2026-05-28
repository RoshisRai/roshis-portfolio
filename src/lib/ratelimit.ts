import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// 40 messages per hour per IP
export const chatRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(40, "1 h"),
    analytics: true,
    prefix: "ratelimit:chat",
})