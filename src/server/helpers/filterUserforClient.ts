import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUserforClient = (user: User)=>{
  return {id: user.id, name: user.firstName,username: user.username, profilePicture: user.profileImageUrl, createdAt: user.createdAt}
}