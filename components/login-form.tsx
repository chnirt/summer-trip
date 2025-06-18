"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInWithAzure } from "@/services/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleLogin = async () => {
    try {
      await signInWithAzure();
    } catch (err) {
      console.error("Unexpected error during login:", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản Microsoft của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogin}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#ff5722"
                      d="M6 6H22V22H6z"
                      transform="rotate(-180 14 14)"
                    ></path>
                    <path
                      fill="#4caf50"
                      d="M26 6H42V22H26z"
                      transform="rotate(-180 34 14)"
                    ></path>
                    <path
                      fill="#ffc107"
                      d="M26 26H42V42H26z"
                      transform="rotate(-180 34 34)"
                    ></path>
                    <path
                      fill="#03a9f4"
                      d="M6 26H22V42H6z"
                      transform="rotate(-180 14 34)"
                    ></path>
                  </svg>
                  Đăng nhập bằng Microsoft
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
