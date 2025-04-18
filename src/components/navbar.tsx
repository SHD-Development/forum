"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ModeToggle } from "./theme-switcher";
import { useEffect, useState } from "react";
import {
  Cloud,
  CircleUser,
  LogIn,
  LogOut,
  IdCard,
  CircleGauge,
} from "lucide-react";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  session: Session | null;
};
const Navbar = ({ session }: Props) => {
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
    <nav
      className={`fixed ${
        isScrolled
          ? "top-0 inset-0 rounded-none max-w-screen border dark:border-slate-700/70 ease-in"
          : "top-6 inset-x-4 rounded-full max-w-screen-2xl border-2 dark:border-zinc-600 ease-out"
      } h-16 mx-auto transition-all duration-225 z-50 backdrop-blur-lg bg-white/75 dark:bg-zinc-950/75`}
    >
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Cloud className="text-black dark:text-white" size={32} />
          <p className="font-bold text-black dark:text-white">Loli Forum</p>
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
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full"
                >
                  <IdCard />
                  Hi, {session.user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser />
                  Profile
                </DropdownMenuItem>
                <a href="/dashboard">
                  <DropdownMenuItem>
                    <CircleGauge />
                    Dashboard
                  </DropdownMenuItem>
                </a>
                <DropdownMenuSeparator />
                <a href="/auth/logout">
                  <DropdownMenuItem>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/auth/login">
              <Button
                variant="outline"
                className="hidden sm:inline-flex rounded-full"
              >
                Login
              </Button>
            </a>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
