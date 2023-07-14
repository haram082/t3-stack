import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";


const filterUserforClient = (user: User)=>{
  return {id: user.id, name: user.firstName,username: user.username, profilePicture: user.profileImageUrl}
}

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 5 requests per 30 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
});



export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc"
      }
    });
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.userId),
      limit: 100,
    })).map(filterUserforClient)

    return posts.map((post) => {
      const user = users.find((user) => user.id === post.userId)!;
      return {
        post,
        user
      };
    });
  }),
  create: privateProcedure.input(z.object({
    content: z.string().min(1)
  })).mutation(async({ctx, input}) => {
    const userId = ctx.currentUser
    const {success} = await ratelimit.limit(userId)

    if(!success){
      throw new TRPCError({code: "TOO_MANY_REQUESTS"})
    }
    const post = await ctx.prisma.post.create({
      data: {
        userId,
        content: input.content
      }
    })
    return post
  })
})
