import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserforClient } from "~/server/helpers/filterUserforClient";





export const profileRouter = createTRPCRouter({
    // query to get a user by their username (for the profile page)
    getUserbyUsername: publicProcedure.input(z.object({username: z.string()}))
    .query(async({ctx, input}) => {
        const [user] = await clerkClient.users.getUserList({
            username: [input.username],
        })
    if(!user){
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
        })
    }
        return filterUserforClient(user)
    }),

  
})
