"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import toast from "react-hot-toast";

export default function DeleteBlogButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/manage-blogs/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Blog deleted");
      router.push("/dashboard/manage-blogs");
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowModal(true)}
        disabled={deleting}
        className="flex items-center gap-1 cursor-pointer"
      >
        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
        Delete
      </Button>

      <DeleteConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}
