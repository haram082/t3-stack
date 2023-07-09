import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserforClient = (user: User)=>{
  return {id: user.id, name: user.firstName,username: user.username, profilePicture: user.profileImageUrl}
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.userId),
      limit: 100,
    }))
    .map(filterUserforClient)

    return posts.map((post) => {
      const user = users.find((user) => user.id === post.userId)!;
      return {
        post,
        user
      };
    });
    
  })
});
