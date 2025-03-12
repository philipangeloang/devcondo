"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UnsubscribedCard = () => {
  const isPaid = false;
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {isPaid ? null : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <Card className="flex w-full max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-3xl font-black">
                Upgrade your Account to Deploy your Page
              </CardTitle>
              <CardDescription>
                Showcase your projects and get more exposure with a paid
                account.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant={"outline"}
                className="cursor-pointer p-6 font-bold"
                onClick={() =>
                  router.replace(`/${session?.user?.username}/admin/upgrade`)
                }
              >
                Deploy my devcondo page
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default UnsubscribedCard;
