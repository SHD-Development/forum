"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./logo";
import { Search } from "lucide-react";
import { ModeToggle } from "../theme-switcher";
import { useEffect, useState } from "react";
import { Cloud } from "lucide-react";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <nav
        className={`fixed ${
          isScrolled
            ? "top-0 inset-0 rounded-none max-w-screen border dark:border-slate-700/70 ease-in"
            : "top-6 inset-x-4 rounded-full max-w-screen-2xl border-2 dark:border-zinc-600 ease-out"
        } h-16 bg-background mx-auto transition-all duration-250 z-50`}
      >
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2 md:gap-6">
            <Cloud size={32} />
            <p className="font-bold">Loli Forum</p>
            <div className="relative hidden md:block">
              <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
              <Input
                className="pl-10 flex-1 bg-slate-100/70 dark:bg-slate-800 border-none shadow-none w-[280px] rounded-full"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className="bg-muted text-foreground hover:bg-accent shadow-none rounded-full md:hidden"
            >
              <Search className="!h-5 !w-5" />
            </Button>
            <a href="/auth/login">
              <Button
                variant="outline"
                className="hidden sm:inline-flex rounded-full"
              >
                Login
              </Button>
            </a>
            <ModeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
