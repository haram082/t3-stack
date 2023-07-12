import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";


const filterUserforClient = (user: User)=>{
  return {id: user.id, name: user.firstName,username: user.username, profilePicture: user.profileImageUrl}
}

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
    const post = await ctx.prisma.post.create({
      data: {
        userId,
        content: input.content
      }
    })
    return post
  })
})
