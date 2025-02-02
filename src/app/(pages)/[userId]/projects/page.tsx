import Content from "@/app/_page-sections/projects/content";
import Footer from "@/app/_page-sections/projects/footer";
import Header from "@/app/_page-sections/projects/header";

//Projects Page

const Projects = () => {
  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-12 gap-4 p-4">
      <Header />
      <Content />
      <Footer />
    </main>
  );
};

export default Projects;
