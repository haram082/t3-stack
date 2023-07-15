import Head from "next/head";
import { InferGetServerSidePropsType, type NextPage } from "next";
import { RouterOutputs, api } from "~/utils/api";

const ProfilePage: NextPage<{username: string}> = ({username}) => {
  const {data, isLoading} = api.profile.getUserbyUsername.useQuery({username: "haram082"})
  console.log(username)
  if(isLoading){
    return <div>loading</div>
  }
  if(!data){
    return <div>no data</div>
  }
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center  h-screen">
        <div>{data.username}</div>
        
      </main>
    </>
  );
}

export default ProfilePage;
