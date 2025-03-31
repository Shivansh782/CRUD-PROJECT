"use client";
import { auth } from "@/utils/app";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    destroyCookie(null, "token");
    router.push("/login");
  };

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
