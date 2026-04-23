"use client";

interface ProfileModalProps {
  user?: {
    name?: string;
    userName?: string;
    email?: string;
  };
  onClose: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function ProfileModal({ user, onChangePassword, onLogout }: ProfileModalProps) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="mb-3">
        <p className="font-medium">{user?.userName || user?.name || "Unknown User"}</p>
        <p className="text-sm text-gray-500 break-words">{user?.email || "No email"}</p>
      </div>

      <div className="border-t my-2" />

      <ul className="space-y-1">
        <li>
          <button
            onClick={onChangePassword}
            className="w-full text-left text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
          >
            Change Password
          </button>
        </li>
      </ul>

      <div className="border-t my-2" />

      <button
        onClick={onLogout}
        className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
