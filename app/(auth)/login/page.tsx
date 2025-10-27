import LoginForm from "@/components/forms/LoginForm";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/authHelpers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (token) {
    try {
      const payload = verifyToken(token);
      if (payload.userId) redirect("/dashboard");
    } catch (err) {
      console.warn("Invalid token", err);
    }
  }

  return (
  <div className="flex justify-center items-center min-h-screen">
    <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <div>
        <LoginForm />
      </div>
    </div>
  </div>)
}
