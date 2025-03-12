import ProviderSignout from "@/app/_components/auth/providers-signout";
import { auth } from "@/server/auth";
import Checkout from "@/app/_components/checkout";

import { HydrateClient } from "@/trpc/server";

import Header from "@/app/_page-sections/upgrade/header";
import Content from "@/app/_page-sections/upgrade/content";
import Footer from "@/app/_page-sections/upgrade/footer";
import { redirect } from "next/navigation";

const Admin = async (props: { params: Promise<{ username: string }> }) => {
  const params = await props.params;
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Redirect if the username is not the same as the session username (Someone trying to edit another user's admin page)
  if (session.user.username !== params.username) {
    redirect(`/${session.user.username}/admin/upgrade`);
  }

  return (
    <HydrateClient>
      <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
        <Header />
        <Content />
        <Footer />
      </main>
    </HydrateClient>
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
