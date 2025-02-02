import { HydrateClient } from "@/trpc/server";
import Hero from "./_page-sections/landing/hero";
import Header from "./_page-sections/landing/header";
import Footer from "./_page-sections/landing/footer";

// Landing Page

const Home = () => {
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
