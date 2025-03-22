import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
import { ModeToggle } from "@/components/theme-switcher";
export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="h-screen bg-zinc-900"></div>
    </div>
  );
}
