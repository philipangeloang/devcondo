"use client";

import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Toaster } from "@/app/_components/ui/sonner";

const DeployCard = () => {
  const utils = api.useUtils();

  const { data: userDeployed } = api.users.get.useQuery();

  const { mutate: updateDeployed, isPending: isUpdatingDeployedPending } =
    api.users.updateDeployed.useMutation({
      onSuccess: async ({ message }) => {
        await utils.users.invalidate();
        toast.success(message, {
          description: new Date().toLocaleTimeString(),
        });
      },
      onError: async (error) => {
        toast.error("Error deploying", {
          description: error.message,
        });
      },
    });

  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl border-2 border-black p-8 dark:border-white">
      <Toaster />
      {/* Abstract pattern */}
      <div className="border-skin-base absolute -top-16 -right-16 h-64 w-64 rounded-full border-8"></div>
      <div className="border-skin-base absolute -bottom-16 -left-16 h-48 w-48 rounded-full border-8"></div>

      <div className="relative flex items-start justify-between">
        <div className="max-w-md space-y-2">
          {userDeployed?.isDeployed ? (
            <>
              <h3 className="text-xl font-bold dark:text-white">
                Do you want to undeploy your portfolio site?
              </h3>
              <p className="text-skin-muted">
                If you undeploy your portfolio site, it will no longer be
                visible
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold dark:text-white">
                Ready to go live?
              </h3>
              <p className="text-skin-muted">
                Deploy your portfolio site with one click and share it with the
                world.
              </p>
            </>
          )}
        </div>
        <Button
          onClick={() => {
            updateDeployed({ isDeployed: true });
          }}
          type="button"
          className="flex cursor-pointer items-center gap-2 px-6 py-5 font-medium text-white dark:bg-white dark:text-black"
        >
          {isUpdatingDeployedPending
            ? userDeployed?.isDeployed
              ? "Undeploying..."
              : "Deploying..."
            : userDeployed?.isDeployed
              ? "Undeploy"
              : "Deploy"}
        </Button>
      </div>
    </div>
  );
};

export default DeployCard;
