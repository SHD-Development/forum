"use client";
import { Button } from "@/components/ui/button";
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
  Menu,
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
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchDialog } from "./search-dialog";

type Props = {
  session: Session | null;
};
const Navbar = ({ session }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const t = useTranslations();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchDialogOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
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
      <div className="h-full flex items-center justify-between mx-auto px-8">
        <div className="flex items-center gap-2 md:gap-6">
          <Cloud className="text-black dark:text-white" size={32} />
          <p className="font-bold text-black dark:text-white">{t("appName")}</p>
          <Button
            variant="outline"
            onClick={() => setSearchDialogOpen(true)}
            className="hidden md:flex md:rounded-lg"
          >
            <Search />
            <div className="hidden md:flex gap-1">
              {t("navbar.search")}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full"
                >
                  <IdCard />
                  {t("navbar.greetings")}
                  {session.user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{t("common.account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser />
                  {t("common.profile")}
                </DropdownMenuItem>
                <Link href="/dashboard">
                  <DropdownMenuItem>
                    <CircleGauge />
                    {t("common.dashboard")}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/auth/logout" prefetch={false}>
                  <DropdownMenuItem>
                    <LogOut />
                    {t("common.logout")}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="hidden sm:inline-flex rounded-full"
              >
                {t("common.login")}
              </Button>
            </Link>
          )}

          <div className="hidden md:flex">
            <ModeToggle />
          </div>
          <Button
            variant="secondary"
            className="md:hidden border-white/50 border-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </Button>

          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("appName")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 p-2">
                <div className="py-2">
                  <p className="text-sm font-medium mb-2">
                    {t("navbar.search")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-lg w-full"
                  >
                    <Search />
                    {t("navbar.search")}
                  </Button>
                </div>
                <div className="py-2">
                  <p className="text-sm font-medium mb-2">
                    {t("common.languages")} & {t("common.themes")}
                  </p>
                  <div className="flex flex-row">
                    <LanguageSwitcher />
                    <div className="mx-1" />
                    <ModeToggle />
                  </div>
                </div>

                <div className="py-2">
                  <p className="text-sm font-medium mb-2">
                    {t("common.account")}
                  </p>
                  {session ? (
                    <div className="space-y-2">
                      <div className="text-lg bg-zinc-200 dark:bg-zinc-900 p-3 rounded-lg">
                        {t("navbar.greetings")} {session.user?.name}
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                      >
                        <CircleGauge size={18} />
                        <span>{t("common.dashboard")}</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                      >
                        <CircleUser size={18} />
                        <span>{t("common.profile")}</span>
                      </Link>
                      <Link
                        href="/auth/logout"
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                        prefetch={false}
                      >
                        <LogOut size={18} />
                        <span>{t("common.logout")}</span>
                      </Link>
                    </div>
                  ) : (
                    <Link href="/auth/login">
                      <Button className="w-full">
                        <LogIn className="mr-2" size={18} />
                        {t("common.login")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Dialog */}
          <SearchDialog
            open={searchDialogOpen}
            onOpenChange={setSearchDialogOpen}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
