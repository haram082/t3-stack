import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { filterUserforClient } from "~/server/helpers/filterUserforClient";

// create a function to filter out the user data we don't want to send to the client


import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import type { Post } from "@prisma/client";

const addUsertoPosts = async (posts: Post[]) => {
  // get the user data for each post
  const users = (await clerkClient.users.getUserList({
    userId: posts.map((post) => post.userId),
    limit: 100,
  })).map(filterUserforClient)

  // return the posts and user data
  return posts.map((post) => {
    const user = users.find((user) => user.id === post.userId)!;
    return {
      post,
      user
    };
  });
}
// Create a new ratelimiter, that allows 5 requests per 30 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
});


// create a router for the post api
export const postRouter = createTRPCRouter({
  // create a query that returns all posts
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc"
      }
    });
    // get the user data for each post
    return addUsertoPosts(posts)
  }),

  // create a query that returns all posts for a user
  getAllForUser: publicProcedure.input(z.object({userId: z.string()}))
  .query(({ctx, input}) => ctx.prisma.post.findMany({
    where: {
        userId: input.userId
  },
    take: 100,
    orderBy: [{
      createdAt: "desc"
    }],
  }).then(addUsertoPosts)),

  // create a query that returns a single post
  getOne: publicProcedure.input(z.object({id: z.string()}))
  .query(async({ctx, input}) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id: input.id}})

    if(!post){ throw new TRPCError({code: "NOT_FOUND"})}
    // get the user data for the post
    return (await addUsertoPosts([post]))[0]
    }),
   





  // create a mutation to create a new post
  create: privateProcedure.input(z.object({
    content: z.string().min(1)}))
    // use the ratelimiter to limit the number of requests a user can make
  .mutation(async({ctx, input}) => {
    const userId = ctx.currentUser
    const {success} = await ratelimit.limit(userId)

    if(!success){
      throw new TRPCError({code: "TOO_MANY_REQUESTS"})
    }

    // create the post
    const post = await ctx.prisma.post.create({
      data: {
        userId,
        content: input.content
      }
    })
    return post
  })
})
