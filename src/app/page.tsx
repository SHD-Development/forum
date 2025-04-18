import Image from "next/image";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen w-full bg-center bg-cover bg-fixed bg-[url(/images/bg/home.jpg)] py-30">
      <Navbar session={session} />
      <section className="space-y-6 flex flex-col items-center justify-center h-full">
        <div className="grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          <div className="bg-zinc-800 rounded-xl w-70 h-100"></div>
          <div className="bg-zinc-800 rounded-xl w-70 h-100"></div>
          <div className="bg-zinc-800 rounded-xl w-70 h-100"></div>
          <div className="bg-zinc-800 rounded-xl w-70 h-100"></div>
        </div>
      </section>
    </div>
  );
}
