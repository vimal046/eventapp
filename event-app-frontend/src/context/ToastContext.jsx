import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

let nextId = 1;

const ToastContext = createContext({
  showToast: (_msg, _type) => {},
  removeToast: (_id) => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", durationMs = 3000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (durationMs > 0) {
        setTimeout(() => removeToast(id), durationMs);
      }
      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-3 right-3 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              `rounded-xl px-4 py-3 shadow-lg border ` +
              (t.type === "success"
                ? "bg-emerald-600 text-white border-emerald-700"
                : t.type === "error"
                ? "bg-red-600 text-white border-red-700"
                : t.type === "warning"
                ? "bg-amber-500 text-white border-amber-600"
                : "bg-blue-600 text-white border-blue-700")
            }
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">{t.message}</div>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => removeToast(t.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
