import { HydrateClient } from "@/trpc/server";
import Content from "@/app/_page-sections/portfolio/content";
import Footer from "@/app/_page-sections/portfolio/footer";
import Header from "@/app/_page-sections/portfolio/header";

//Portfolio Page

const Portfolio = () => {
  return (
    <HydrateClient>
      <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
        <Header />
        <Content />
        <Footer />
      </main>
    </HydrateClient>
  );
};

export default Portfolio;
