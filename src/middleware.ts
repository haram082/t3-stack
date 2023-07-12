import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // beforeAuth: ()=> false
});

// Path: my-t3-app\src\config.ts
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};