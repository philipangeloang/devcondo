import ProviderSignout from "@/app/_components/auth/providers-signout";
import { auth } from "@/server/auth";
import Checkout from "@/app/_components/checkout";

import { api, HydrateClient } from "@/trpc/server";
import { Button } from "@/app/_components/ui/button";

// https://dribbble.com/shots/21326778-Portfolio-Site

const Admin = async () => {
  // const session = await auth();
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
