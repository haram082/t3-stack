import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignInButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "~/components/loading";





const CreatePostWizard =()=>{
  const{user} = useUser()
  const [input, setInput] = useState("")
  const ctx = api.useContext()

  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: ()=>{
      setInput("")
      void ctx.posts.getAll.invalidate()
    },
    onError: ()=>{
      toast.error("Failed to post")
    }
  })
  if(!user) return null
  return(
    <div className="flex gap-4 w-full">
      <Image src={user.profileImageUrl} alt="pfp"  className="rounded-full" width={64} height={64}/>
      <input type="text" placeholder="Create a Post" className="bg-transparent outline-none grow" 
      value={input}
      onChange={(e)=> setInput(e.target.value)} 
      disabled={isPosting}/>
      {!isPosting &&
      <button onClick={()=> mutate({content:input})} disabled={isPosting}
      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
        Post</button>}
      {isPosting && <LoadingSpinner/>}
      </div>
  )
}


type PostWithUser = RouterOutputs["posts"]["getAll"][number]
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";

dayjs.extend(relativeTime);

const PostView = (props: PostWithUser)=>{
  const {post, user} = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image src={user.profilePicture} alt="author_pfp" className="rounded-full" width={48} height={48}/>
      <div className="flex flex-col">
        <div className="flex gap-1">
          <Link href={`/@${user.username}`}><span className="font-bold text-slate-200 hover:border-b-2">{user.name}</span></Link>
          <span className="text-slate-300 ">@{user.username} ·</span>
          <Link href={`/post/${post.id}`}> 
          <span className="text-slate-300 hover:border-b">{dayjs(post.createdAt).fromNow()}</span></Link>
        </div>
        <span className="text-xl">{post.content}</span>
        </div>
    </div>
  )
    
}


const Feed = () =>{
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery()
  if(postsLoading){
    return <LoadingPage/>
  }
  if (!data){
    return <div>no posts</div>
  }
  return(
    <div className="flex flex-col">
      {data?.map((post)=>(
        <PostView key={post.post.id} post={post.post} user={post.user}/>
      ))}
    </div>
  )
}

export default function Home() {
  const {isLoaded: userLoaded,  isSignedIn} = useUser()

  // start fetchin immediately
  api.posts.getAll.useQuery()

  //nothing if user not loaded
  if (!userLoaded ){
    return <div></div>
  }
  
  return (
    <>
      
      <main className="flex justify-center  h-screen">
        <div className="h-full w-full md:max-w-2xl border-x border-slate-400">
      <div className="border-b border-slate-400 p-8 flex justify-between">
      {isSignedIn && <CreatePostWizard />} 
       </div>
      <Feed/>
      </div> 


      <div>
      {!isSignedIn && <SignInButton />}
      {isSignedIn && <SignOutButton />}</div>
      </main>
    </>
  );
}
