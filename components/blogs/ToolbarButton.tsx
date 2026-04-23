import { ReactNode } from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title?: string;
  children: ReactNode;
}

export default function ToolbarButton({ onClick, isActive = false, children, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`px-2 py-1 text-sm rounded transition cursor-pointer ${
        isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
