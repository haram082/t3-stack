import { PropsWithChildren } from "react";
import { SignInButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Sidebar = () => {
    const {user, isSignedIn} = useUser()
    if(!user) return null
    if(!user.username) return null
    return (
        <ul className="pr-4 text-center flex flex-col gap-2 mt-2">
            <Link href="/">Home</Link>
            <li>Music</li>
            <li>Library</li>
            <Link href={`/@${user.username}`}>Profile</Link>
            <li>
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <SignOutButton />}</li>
        </ul>
    )
}

export const PageLayout = (props: PropsWithChildren)=>{
    return(
    <main className="flex h-screen ">
        <div className="sidebar-container h-full w-[160px] border-r border-slate-400">
            <Sidebar/>
        </div>
        <div className="feed-container h-full w-full md:max-w-2xl border-x border-slate-400 overflow-y-scroll  overflow-hidden">
            {props.children}
      </div>
     
    </main>
    ) 
}
