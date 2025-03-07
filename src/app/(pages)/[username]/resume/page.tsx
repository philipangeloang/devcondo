import { HydrateClient } from "@/trpc/server";
import Content from "@/app/_page-sections/resume/content";
import Footer from "@/app/_page-sections/resume/footer";
import Header from "@/app/_page-sections/resume/header";

const Resume = () => {
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

export default Resume;
