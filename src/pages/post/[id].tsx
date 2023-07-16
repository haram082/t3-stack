import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";
import Link from "next/link";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);


const SinglePostPage: NextPage = () => {
  const router = useRouter()
  // Get the id parameter from the router query object
  const {id} = router.query
  if(typeof id !== "string") return null
  const {data, isLoading} = api.posts.getOne.useQuery({id})
  if(isLoading){
    return <LoadingPage/>
  }
  if(!data){
    return <div>no data</div>
  }
  const {post, user} = data

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div className="flex flex-col gap-6 p-6 border-b">
        <span><Link href="../"><i className="fa-solid fa-arrow-left text-slate-100"></i> Back</Link></span>
          <div className="flex flex-row gap-4">
          <Link href={`/@${user.username}`}><Image src={user.profilePicture} alt="author_pfp" className="rounded-full hover:scale-[1.03] hover:opacity-50" width={56} height={56}/></Link>
          <div className="flex flex-col">
          <Link href={`/@${user.username}`}><span className="font-bold text-lg text-slate-100 hover:border-b-2">{user.name}</span></Link>
              <span className="text-base text-slate-300">@{user.username}</span>
          </div>
          </div>
          <div className="text-xl text-slate-100">{post.content}</div>
          <div className="text-sm text-slate-300">{ dayjs(post.createdAt).format("h:mm A · MMMM D, YYYY ")}</div>
        </div>
       
      </PageLayout>
    </>
  );
}

export default SinglePostPage;