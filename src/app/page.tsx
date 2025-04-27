import { Suspense } from "react";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { PostsList } from "@/components/posts-list";
import styles from "./home.module.css";
export default async function Home() {
  const session = await auth();
  const t = await getTranslations("homePage");

  return (
    <div className={styles.home}>
      <div className="min-h-screen w-full bg-center bg-cover bg-fixed bg-[url(/images/bg/home.jpg)] py-30">
        <Navbar session={session} />
        <section className="container mx-auto px-4 py-12 space-y-6">
          <div className="flex flex-col mb-10 bg-white dark:bg-zinc-900 w-3/4 lg:w-1/3 p-3 rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t("latestPosts")}
            </h1>
            <p className="text-muted-foreground">
              {t("latestPostsDescription")}
            </p>
          </div>

          <Suspense
            fallback={<div className="text-center py-12">Loading posts...</div>}
          >
            <PostsList initialLimit={16} session={session} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
