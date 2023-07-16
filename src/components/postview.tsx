import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RouterOutputs } from "~/utils/api";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Define the type for the post and user
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  // Destructure the post and user from the props
    const { post, user } = props;
    // Render the post
    return(
        <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Link href={`/@${user.username}`}><Image src={user.profilePicture} alt="author_pfp" className="rounded-full hover:scale-[1.03] hover:opacity-50" width={48} height={48}/></Link>
      <div className="flex flex-col">
        <div className="flex gap-1">
          <Link href={`/@${user.username}`}><span className="font-bold text-slate-200 hover:border-b-2">{user.name}</span></Link>
          <span className="text-slate-300 ">@{user.username} ·</span>
          <Link href={`/post/${post.id}`}> 
          <span className="text-slate-300 hover:border-b">{ dayjs(post.createdAt).fromNow()}</span></Link>
        </div>
        <Link href={`/post/${post.id}`}> <span className="text-xl w-full">{post.content}</span></Link>
        </div>
    </div>
    )
}
