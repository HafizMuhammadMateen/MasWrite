import SignupForm from "@/components/forms/SignupForm"

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <div>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}