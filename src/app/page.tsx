import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import { PostCard } from "@/components/post-card";
import { PrismaClient } from "@prisma/client";
import { getTranslations } from "next-intl/server";
const prisma = new PrismaClient();

export default async function Home() {
  const session = await auth();
  const t = await getTranslations("homePage");
  const posts = await prisma.post.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen w-full bg-center bg-cover bg-fixed bg-[url(/images/bg/home.jpg)] py-30">
      <Navbar session={session} />
      <section className="container mx-auto px-4 py-12 space-y-6">
        <div className="flex flex-col mb-10 bg-white dark:bg-zinc-900 w-1/3 p-3 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t("latestPosts")}
          </h1>
          <p className="text-muted-foreground">{t("latestPostsDescription")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-zinc-900/90 rounded-lg">
              <p className="text-lg text-muted-foreground">
                No posts available yet.
              </p>
              {session && (
                <a
                  href="/dashboard/post/create"
                  className="mt-4 inline-block underline"
                >
                  Create your first post
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
