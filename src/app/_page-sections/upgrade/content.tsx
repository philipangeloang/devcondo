"use client";

import React from "react";

import { useState } from "react";
import { Check, Moon, Sun } from "lucide-react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

export default function PricingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const features = [
    { text: "Ship smarter with analytics", highlight: "analytics" },
    { text: "Collect emails", highlight: "" },
    { text: "Build trust with Stripe revenue", highlight: "Stripe revenue" },
    { text: "Custom domain", highlight: "" },
    { text: "Compete for the Leaderboards", highlight: "Leaderboards" },
    { text: "Search engines follow your links", highlight: "" },
    { text: "28 themes and 9 fonts", highlight: "" },
  ];

  return (
    <ScrollArea className="col-span-12 sm:h-[calc(100vh-204px)]">
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black blur-3xl dark:bg-white" />
          <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-black blur-3xl dark:bg-white" />
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
          {/* Header */}
          <div className="mb-20 space-y-4 text-center">
            <h1 className="text-4xl font-bold md:text-6xl">
              Deploy your Indie Page, get more
              <br />
              customers, grow on X
            </h1>
            <div className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm dark:bg-gray-800">
              💎 $30 off in March
            </div>
          </div>

          {/* Content */}
          <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Features List */}
            <div className="space-y-6 rounded-2xl border-2 border-gray-200 p-8 lg:col-span-1 dark:border-gray-800">
              <h2 className="mb-8 text-2xl font-bold">
                Showcase your startups
              </h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span>
                      {feature.text
                        .split(feature.highlight)
                        .map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="font-semibold underline underline-offset-4">
                                {feature.highlight}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:col-span-2">
              {/* 1-Year Pass */}
              <div className="flex h-full flex-col rounded-2xl border-2 border-gray-200 p-8 dark:border-gray-800">
                <h3 className="mb-6 text-2xl font-bold">1-Year Pass</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      $55
                    </span>
                    <span className="text-4xl font-bold">$25</span>
                    <span className="text-gray-500">USD</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    One-time payment. No subscription
                  </p>
                </div>
                <button className="mt-auto w-full rounded-xl bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                  DEPLOY NOW
                </button>
              </div>

              {/* Lifetime Deal */}
              <div className="relative flex h-full flex-col rounded-2xl border-2 border-black p-8 dark:border-white">
                <div className="absolute -top-3 right-4 rounded-full bg-black px-3 py-1 text-sm text-white dark:bg-white dark:text-black">
                  POPULAR
                </div>
                <h3 className="mb-6 text-2xl font-bold">Lifetime Deal</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      $75
                    </span>
                    <span className="text-4xl font-bold">$45</span>
                    <span className="text-gray-500">USD</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    One-time payment. No subscription
                  </p>
                </div>
                <button className="mt-auto w-full rounded-xl bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                  DEPLOY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
