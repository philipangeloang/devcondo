import Content from "@/app/_page-sections/resume/content";
import Footer from "@/app/_page-sections/resume/footer";
import Header from "@/app/_page-sections/resume/header";

const Resume = () => {
  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
      <Header />
      <Content />
      <Footer />
    </main>
  );
};

export default Resume;
