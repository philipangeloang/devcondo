import { HydrateClient } from "@/trpc/server";
import Hero from "./_page-sections/landing/hero";
import Header from "./_page-sections/landing/header";
import Footer from "./_page-sections/landing/footer";

// Uncomment the following lines to enable authentication
// import { getServerAuthSession } from "@/server/auth";
// import { api } from "@/trpc/server";

const Home = () => {
  // Uncomment the following lines to enable authentication
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Home;
