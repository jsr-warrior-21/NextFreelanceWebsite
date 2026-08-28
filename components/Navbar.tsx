"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { LogOut, UserPlus, LogIn, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
        >
          Mystery Message
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
                Welcome,{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user?.username || user?.email}
                </span>
              </span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 rounded-xl"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
