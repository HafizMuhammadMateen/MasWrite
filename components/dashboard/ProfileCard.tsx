"use client";

import Link from "next/link";
import { useState } from "react";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

interface ProfileCardProps {
  userName: string;
  email: string;
}

export default function ProfileCard({ userName, email }: ProfileCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
  <section className="bg-gray-100 p-6 text-center flex flex-col items-center">
    <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
      {userName.charAt(0).toUpperCase()}
    </div>

    <h2 className="text-xl font-semibold mt-3 text-gray-800">{userName}</h2>
    <p className="text-gray-500">{email}</p>

    <Link
      href="/dashboard/blogs"
      className="mt-5 inline-block bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition"
    >
      Manage Blogs
    </Link>

    <button
      onClick={() => setIsModalOpen(true)}
      className="mt-3 inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
    >
      Change Password
    </button>

    {/* Modals */}
    <ChangePasswordModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  </section>
);

}
