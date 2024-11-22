import SignInForm from "@/components/sign-in-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user.role === "admin") {
    redirect("/admin");
  }

  if (session?.user.role === "employee") {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Sign in</h1>
      <SignInForm />
    </main>
  );
}
