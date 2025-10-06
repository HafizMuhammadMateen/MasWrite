"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const[isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch("/api/dashboard", {
        method: "GET",
        credentials: "include", // ensures cookies are sent
      });

      const result = await res.json();
      setData(result);
    }
    fetchDashboard();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  }

  if (!data) return <p>Loading...</p>;
  
  if (data.error) {
    router.push("/login");
    return <p>❌ {data.error}</p>;
  }

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-lg text-green-700 text-center">
          {data.message}
        </p>

        <div className="bg-gray-100 rounded-md p-4 text-sm text-gray-600 overflow-x-auto">
          <pre>{JSON.stringify(data.user, null, 2)}</pre>
        </div>
      </div>


      <button
        type="reset"
        onClick={() => setIsModalOpen(true)}
        className="mt-8 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer transition"
      >
        Change Password
      </button>

      <ChangePasswordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <button
        type="reset"
        onClick={handleLogout}
        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 cursor-pointer transition"
      >
        Logout
      </button>
    </div>
  </div>
  );
}
