"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Progress } from "@/app/_components/ui/progress";

export default function AuthCallback() {
  const [progress, setProgress] = useState(13);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(44), 100);
    if (status === "authenticated" && session?.user) {
      const username = session.user.username;
      clearTimeout(timer);
      setProgress(100);
      router.replace(`/${username}/admin`); // Redirect to the user's dynamic page
    }
  }, [session, status, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Progress value={progress} className="w-[30%]" />
    </div>
  );
}
