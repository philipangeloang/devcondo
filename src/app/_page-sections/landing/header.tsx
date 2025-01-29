import Brand from "../../_components/blocks/Brand";
import Hamburger from "../../_components/blocks/Hamburger";
import NavCTA from "../../_components/blocks/NavCTA";
import Navlinks from "../../_components/blocks/Navlinks";
import Themer from "../../_components/blocks/Themer";

const Header = () => {
  return (
    <section className="w-full">
      <nav className="mx-auto flex max-w-screen-xl justify-between p-4">
        <Brand />
        <Hamburger />
        <Navlinks />
        <div className="hidden md:flex md:items-center md:gap-3">
          <NavCTA />
          <Themer />
        </div>
      </nav>
    </section>
  );
};

export default Header;
