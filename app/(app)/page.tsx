"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, LayoutDashboard, MessageSquare } from "lucide-react";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  const { data: session } = useSession();

  return (
    <div className="flex-grow flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 text-center space-y-10">
        {/* Hero Section */}
        <section className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">
            <MessageSquare className="w-4 h-4 text-slate-900 dark:text-slate-100" />
            <span>Anonymous Social Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Dive into the World of Anonymous Conversations.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
            Explore Mystery Message — Where your identity remains a secret and feedback is completely honest.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg transition-all flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Carousel Showcase */}
        <section className="w-full max-w-lg pt-6">
          <Carousel
            plugins={[AutoPlay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((item, index) => (
                <CarouselItem key={item.id || index}>
                  <div className="p-2">
                    <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                      <CardHeader className="text-lg font-bold text-slate-800 dark:text-slate-200 pt-6 px-6">
                        {item.title}
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-6 text-center">
                        <span className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                          "{item.content}"
                        </span>
                      </CardContent>
                      <CardFooter className="text-xs text-slate-400 dark:text-slate-500 font-medium pb-6 px-6 justify-end">
                        {item.received}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
        </section>
      </main>

      <footer className="py-6 text-center text-sm font-medium text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50">
        © 2026 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
