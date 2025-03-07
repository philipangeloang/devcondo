"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const username = session?.user.username;
      console.log("DITO TINGIN", username);
      router.replace(`/${username}/admin`); // Redirect to the user's dynamic page
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
}
