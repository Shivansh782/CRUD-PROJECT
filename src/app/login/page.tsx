"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import loginImage from "@/Images/login.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/spinner";
import { auth } from "@/utils/app";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.get("email") as string,
        data.get("password") as string
      );
      const token = await userCredential.user.getIdToken();
      setCookie(null, "token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
      });
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.code.split("/")[1].replace(/-/g, " "));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const toastMessage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("toastMessage="))
      ?.split("=")[1];
    if (toastMessage) {
      toast.error(decodeURIComponent(toastMessage));
      document.cookie =
        "toastMessage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, []);

  const tryAgain = () => {
    setErrorLoading(true);
    setError(null);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center bg-white text-black max-md:flex-col md:flex-row">
          <div className="w-1/4 flex items-center justify-center h-full shadow-xl flex-col max-md:w-full max-md:shadow-none max-md:h-[40%] ">
            <h2 className="w-10/12 text-left text-4xl font-semibold font-pub max-md:w-full max-md:text-center max-md:text-3xl">
              Welcome Back
            </h2>
            <Image alt="Login" src={loginImage} className="mt-8" />
          </div>
          <div className="w-3/4 flex items-center justify-center max-md:w-full">
            {error ? (
              <div className="bg-white">
                <Card className="max-w-xl border-none shadow-none ">
                  <CardHeader>
                    <CardTitle className="text-red-700 font-semibold">
                      {errorLoading ? <Spinner /> : error}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => tryAgain()}
                      className="w-full rounded bg-[#982929] py-3 text-white transition-colors hover:bg-[#6a1c1c] cursor-pointer"
                    >
                      Try again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="max-w-xl border-none shadow-none bg-white">
                <CardContent>
                  <div className="flex justify-center mb-4">
                  </div>
                  <form
                    className="space-y-4"
                    onSubmit={handleLogin}
                    // autoComplete="off"
                  >
                    <div>
                      <Input
                        className="py-6 px-4 focus:ring-1 focus:ring-[#982929]"
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Input
                        className="py-6 px-4 focus:ring-1 focus:ring-[#982929] text-black"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeIcon
                            size={20}
                            className="text-black hover:bg-white"
                          />
                        ) : (
                          <EyeOffIcon
                            size={20}
                            className="text-black hover:bg-white"
                          />
                        )}
                      </Button>
                    </div>
                    <div className="text-left">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-red-700 font-semibold hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded bg-[#982929] text-white transition-colors hover:bg-[#6a1c1c] cursor-pointer py-6 text-lg "
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
