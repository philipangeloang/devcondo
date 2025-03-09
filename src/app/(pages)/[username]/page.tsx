import { HydrateClient } from "@/trpc/server";
import Content from "@/app/_page-sections/portfolio/content";
import Footer from "@/app/_page-sections/portfolio/footer";
import Header from "@/app/_page-sections/portfolio/header";
import UnsubscribedCard from "@/app/_components/blocks/unsubscribed-card";
const Portfolio = async () => {
  return (
    <HydrateClient>
      <UnsubscribedCard />
      <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
        <Header />
        <Content />
        <Footer />
      </main>
    </HydrateClient>
  );
};

export default Portfolio;
