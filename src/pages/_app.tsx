import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        
        <script src="https://kit.fontawesome.com/ed688a6948.js" crossOrigin="anonymous"></script>
      </Head>
      <Toaster />
      <Component {...pageProps} />
    </ClerkProvider>
  )
};

export default api.withTRPC(MyApp);
