"use client";
import { api } from "@/trpc/react";

export default function DisplayName() {
  //TRPC Hooks
  const { data: aboutInfo, isLoading } = api.aboutInfo.get.useQuery();

  if (isLoading) {
    return (
      <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-900/10 dark:bg-neutral-50/10" />
    );
  }

  return <span>{aboutInfo?.name}</span>;
}
