"use client";

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="mb-3">
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-gray-500">john.doe@gmail.com</p>
      </div>

      <div className="border-t my-2"></div>

      <ul className="space-y-2">
        <li>
          <button className="w-full text-left text-gray-700 hover:bg-gray-100 px-2 py-1 rounded">
            Change Password
          </button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 hover:bg-gray-100 px-2 py-1 rounded">
            Settings
          </button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 hover:bg-gray-100 px-2 py-1 rounded">
            Help
          </button>
        </li>
      </ul>

      <div className="border-t my-2"></div>

      <button
        onClick={onClose}
        className="w-full text-left text-red-600 hover:bg-gray-100 px-2 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
