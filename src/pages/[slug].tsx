import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import Link from "next/link";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

// The slug parameter is a string that starts with an @ symbol

export const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getAllForUser.useQuery({userId: props.userId})
  if(isLoading){
    return <LoadingSpinner/>
  }
  if(!data){
    return <div>no data</div>
  }
  return (
    <div className="flex flex-col">
      {data?.map((post)=>(
        <PostView key={post.post.id} post={post.post} user={post.user}/>
      ))}
    </div>
  )
}

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const{user} = useUser()
  // Get the slug parameter from the router query object
  const {slug} = router.query
  if(typeof slug !== "string") return null

  // Fetch the user data using the getUserbyUsername method from the profile router
  const name = slug.replace("@", "")
  const {data, isLoading} = api.profile.getUserbyUsername.useQuery({username: name})
  
  if(isLoading){
    return <LoadingPage/>
  }
  if(!data){
    return <div>no data</div>
  }
  return (
    <>
      <Head>
        <title>{slug}</title>
      </Head>
      <PageLayout>
      <div className="p-3"><Link href="../"><i className="fa-solid fa-arrow-left text-slate-100"></i> Back</Link></div>
        <div className="h-[200px] border-b border-slate-400 bg-slate-500 relative">
          <Image src ={data.profilePicture} alt= {`${data.username}pfp`}
           width ={96} height={96}
            className="rounded-full absolute bottom-0 left-0 ml-4 -mb-[48px] border-2"
           />
        </div>
        <div className="relative">
        {user && user.username === name && <button className="p-2 text-l text-slate-300 absolute right-3  top-3 border rounded-lg border-slate-600"> Edit Profile</button>}
        <div className="h-[64px]"></div>
        <div className="p-4 pb-0 text-2xl font-bold">{data.name}</div>
        <div className="p-4 pt-0 text-l text-slate-300">@{data.username}</div>
        <div className="p-4 pt-0 text-l text-slate-300"><span><i className="fa fa-calendar" aria-hidden="true"></i></span> Joined {dayjs(data.createdAt).format("MMM D, YYYY")}</div>
        <div className="w-full border-b border-slate-400"></div>
        </div>
        <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
}



export default ProfilePage;
