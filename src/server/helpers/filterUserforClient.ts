import type { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";


export const filterUserforClient = (user: User)=>{
  return {id: user.id, name: user.firstName,username: user.username, profilePicture: user.profileImageUrl}
}