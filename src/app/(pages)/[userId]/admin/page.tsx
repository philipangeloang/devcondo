import ProviderSignout from "@/app/_components/auth/providers-signout";
import { auth } from "@/server/auth";
import Checkout from "@/app/_components/checkout";

import { api, HydrateClient } from "@/trpc/server";
import { Button } from "@/app/_components/ui/button";
import Header from "@/app/_page-sections/admin/header";
import Content from "@/app/_page-sections/admin/content";
import Footer from "@/app/_page-sections/admin/footer";

// https://dribbble.com/shots/21326778-Portfolio-Site

const Admin = async () => {
  // const session = await auth();

  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
      <Header />
      <Content />
      <Footer />
    </main>
  );
  // return (
  //   <div>
  //     <div>Admin</div>
  //     {session && session.user ? (
  //       <>
  //         <p>Logged in as {session.user.email}</p>
  //         <div>
  //           <img className="h-32 w-32 rounded-full" src={session.user?.image} />
  //         </div>
  //       </>
  //     ) : (
  //       <p>Not logged in</p>
  //     )}
  //     <Checkout />
  //     <ProviderSignout />
  //   </div>
  // );
};

export default Admin;
