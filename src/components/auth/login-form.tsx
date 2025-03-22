import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/auth";
import { FaGoogle, FaDiscord } from "react-icons/fa6";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  async function googleLogin() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }
  async function discordLogin() {
    "use server";
    await signIn("discord", { redirectTo: "/dashboard" });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Loli Forum account
                </p>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Continue with
                </span>
              </div>

              <div className="grid grid-rows-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={googleLogin}
                >
                  <FaGoogle />
                  <span>Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={discordLogin}
                >
                  <FaDiscord />
                  <span>Discord</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/amamiya.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
