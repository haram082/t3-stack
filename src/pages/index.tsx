import {api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "~/components/loading";





const CreatePostWizard =()=>{
  const{user} = useUser()
  const [input, setInput] = useState("")
   // Get the posts router from the API context
  const ctx = api.useContext()

  // Define the mutation function for creating a post
  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    //clear the input field and invalidate the cache for the getAll method of the posts router
    onSuccess: ()=>{
      setInput("")
      void ctx.posts.getAll.invalidate()
    },
    onError: ()=>{
      toast.error("Failed to post")
    }
  })


  if(!user) return null
  // ui for creating a post
  return(
    <div className="flex gap-4 w-full">
      <Image src={user.profileImageUrl} alt="pfp"  className="rounded-full" width={64} height={64}/>
      <input type="text" placeholder="Create a Post" className="bg-transparent outline-none grow " 
      value={input}
      onChange={(e)=> setInput(e.target.value)} 
      disabled={isPosting}/>
      {!isPosting &&
      <button onClick={()=> mutate({content:input})} disabled={isPosting}
      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
        Post </button>}
      {isPosting && <LoadingSpinner/>}
      </div>
  )
}


import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import { PostView } from "~/components/postview";



// Define the feed component
const Feed = () =>{
  // Get the posts from the getAll method of the posts router
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery()
  if(postsLoading){
    return <LoadingPage/>
  }
  if (!data){
    return <div>no posts</div>
  }
  // Render the posts
  return(
    <div className="flex flex-col">
      {data?.map((post)=>(
        <PostView key={post.post.id} post={post.post} user={post.user}/>
      ))}
    </div>
  )
}

import { PageLayout } from "~/components/layout";
export default function Home() {
  //
  const {isLoaded: userLoaded,  isSignedIn} = useUser()

  // start fetchin immediately
  api.posts.getAll.useQuery()

  //nothing if user not loaded
  if (!userLoaded ){
    return <div></div>
  }
  
  return (
    <>
      <PageLayout>
      <div className="border-b border-slate-400 p-8 flex justify-between">
      {isSignedIn && <CreatePostWizard />} 
       </div>
      <Feed/>
      </PageLayout>
      
      
    </>
  );
}
