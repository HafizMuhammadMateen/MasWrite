import LoginForm from "../../components/forms/LoginForm";

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
        <div>
            <LoginForm />
        </div>
      </div>
    </div>
  );
}