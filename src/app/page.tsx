import { Suspense } from "react";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { PostsList } from "@/components/posts-list";
import { Hash } from "lucide-react";
export default async function Home() {
  const session = await auth();
  const t = await getTranslations("homePage");

  return (
    <div className="min-h-screen w-full bg-center bg-cover bg-fixed bg-[url(/images/bg/home.webp)]">
      <Navbar session={session} />
      <div className="backdrop-blur-sm py-30 min-h-screen dark:backdrop-brightness-50">
        <section className="container mx-auto px-4 py-12 space-y-6">
          <div className="flex flex-col mb-10 bg-white dark:bg-zinc-900 w-full lg:w-1/3 p-7 rounded-lg relative overflow-hidden shadow-lg shadow-black/50">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 z-1">
              {t("latestPosts")}
            </h1>
            <p className="text-muted-foreground z-1">
              {t("latestPostsDescription")}
            </p>
            <Hash className="hidden md:flex w-65 h-65 text-zinc-200 dark:text-zinc-800 absolute top-1/2 -translate-y-1/2 right-5 transform rotate-20 z-0" />
          </div>

          <Suspense
            fallback={<div className="text-center py-12">{t("loading")}</div>}
          >
            <PostsList initialLimit={16} session={session} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
