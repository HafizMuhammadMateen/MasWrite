"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { KeyRound, Mail, User, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";

function Field({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const user = useCurrentUser();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile section */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Profile</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your account information</p>
        </div>

        {/* Avatar row */}
        <div className="px-5 py-4 flex items-center gap-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary text-lg font-bold flex items-center justify-center shrink-0">
            {user
              ? (user.userName || user.name || "U")
                  .split(/[\s_]+/)
                  .map((w: string) => w[0]?.toUpperCase())
                  .slice(0, 2)
                  .join("")
              : "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.userName || user?.name || "—"}</p>
            <p className="text-sm text-gray-400">{user?.email || "—"}</p>
          </div>
        </div>

        <div className="px-5">
          <Field label="Display name" value={user?.name} icon={User} />
          <Field label="Username" value={user?.userName} icon={AtSign} />
          <Field label="Email" value={user?.email} icon={Mail} />
        </div>
      </section>

      {/* Security section */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Security</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage your password and login settings</p>
        </div>

        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => setShowChangePassword(true)}
          >
            Change
          </Button>
        </div>
      </section>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
}
