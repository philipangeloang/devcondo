import "@/styles/globals.css";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./_components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "devcondo",
  description: "Developers' place to live",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-skin-fill">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
