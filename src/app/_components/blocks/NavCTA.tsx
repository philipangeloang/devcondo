import { Separator } from "@radix-ui/react-separator";
import DiscordSignin from "../auth/discord-signin";
import EmailSignin from "../auth/email-signin";
import GithubSignin from "../auth/github-signin";
import GoogleSignin from "../auth/google-signin";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const NavCTA = () => {
  return (
    // <Button className="w-full bg-light-yellow text-main-black hover:bg-light-yellow/80 dark:bg-dark-yellow dark:text-main-white dark:hover:bg-dark-yellow/80">
    //   Log in
    // </Button>
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-skin-button-accent hover:bg-skin-button-accent-hover text-skin-base w-full cursor-pointer">
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center sm:max-w-[375px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl">Log in to Financify</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <DiscordSignin />
          <GithubSignin />
          <GoogleSignin />
          <Separator className="w-full" />
          <EmailSignin />
          <p className="text-main-gray mt-5 px-5 text-xs">
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NavCTA;
