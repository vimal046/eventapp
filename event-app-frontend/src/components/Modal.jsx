import { useEffect } from "react";

export default function Modal({
  open,
  title = "",
  children,
  onClose,
  actions,
}) {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-xl card dark:bg-gray-800">
        {title ? (
          <div className="text-lg font-semibold mb-2">{title}</div>
        ) : null}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
}
