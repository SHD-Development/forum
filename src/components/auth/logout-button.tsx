import { signOut } from "@/auth";
import { Button } from "../ui/button";
export default function LogOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/auth/login" });
      }}
    >
      <Button type="submit">Logout</Button>
    </form>
  );
}
