import { Badge } from "../../_components/ui/badge";
import { Button } from "../../_components/ui/button";

const Hero = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col justify-center p-4">
        <div className="mx-auto my-12 flex max-w-[768px] flex-col justify-center gap-5">
          <div className="flex flex-col gap-2">
            <h5 className="text-center">
              <Badge className="bg-skin-button-muted text-skin-inverted">
                version 0.0.1
              </Badge>
            </h5>
            <h1 className="text-skin-base xs:text-6xl/[1.2] text-center text-5xl font-black">
              Showcase your <br /> Portfolio in Minutes
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-skin-muted text-center">
              Showcase your skills, projects, and experience with a sleek,
              professional portfolio—no hassle, just results. Customize
              effortlessly and connect with opportunities. Your work deserves to
              be seen.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="hover:bg-skin-button-accent-hover text-skin-base text-md xs:w-[250px] xs:py-6 bg-skin-button-accent w-full p-20">
                Create your Portfolio
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[36rem] w-full rounded-lg border-2"></div>
      </div>
    </section>
  );
};

export default Hero;

/* HERO DESIGN 1 CENTERED HEADING TEXT
<div className="mx-auto flex max-w-(--breakpoint-xl) flex-col justify-center p-4">
  <div className="mx-auto my-12 flex max-w-[768px] flex-col justify-center gap-5">
     <div className="flex flex-col gap-2">
        <h5 className="text-center">
          <Badge className="">Lorem Ipsum Dolor Sit</Badge>
        </h5>
        <h1 className="xs:text-6xl text-center text-5xl font-black">
          Lorem ipsum dolor sit amet <span>consectetur</span>
        </h1>
      </div>
          <div className="flex flex-col gap-4">
            <p className="text-center text-main-black/60 dark:text-main-white/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              malesuada, nunc nec auctor lacinia, libero odio ultricies libero,
              nec vulputate mi felis nec erat.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="xs:w-[150px] w-full bg-light-yellow text-main-black hover:bg-light-yellow/80 dark:bg-dark-yellow dark:text-main-white dark:hover:bg-dark-yellow/80">
                Get Started
              </Button>
              <Button className="xs:w-[150px] w-full text-main-white dark:text-main-black">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        // This can be a big image or a video or a carousel
        <div className="h-[36rem] w-full rounded-lg border-2 border-main-black dark:border-main-white"></div> 
     </div>
*/

/* HERO DESIGN 2 LEFT HEADING TEXT
 <div className="my mx-auto my-12 flex max-w-(--breakpoint-xl) flex-col items-center justify-center gap-10 p-4 lg:flex-row">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h1 className="text-5xl font-black xs:text-6xl">
            Lorem ipsum dolor sit amet <span>consectetur</span>
          </h1>
          <p className="text-main-black/60 dark:text-main-white/60">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            malesuada, nunc nec auctor lacinia, libero odio ultricies libero,
            nec vulputate mi felis nec erat.
          </p>
          <Button className="mx-auto w-full bg-light-yellow text-main-black hover:bg-light-yellow/80 dark:bg-dark-yellow dark:text-main-white dark:hover:bg-dark-yellow/80 xs:h-[50px] xs:w-[200px] lg:mx-0">
            Get Started
          </Button>
        </div>

        // This can be a big image or a video or a carousel
        <div className="h-[36rem] w-full rounded-lg border-2 border-main-black dark:border-main-white"></div>
      </div>
*/
