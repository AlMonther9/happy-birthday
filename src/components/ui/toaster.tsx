"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast, type Toast as ToastType } from "@/hooks/use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 px-4 py-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse sm:items-end sm:px-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastType;
  onDismiss: (id: string) => void;
}) {
  const { id, title, description, variant = "default" } = toast;

  const variantClasses = {
    default: "bg-white text-gray-900 border border-gray-200",
    destructive: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-cyan-600 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-sm overflow-hidden rounded-lg shadow-lg ${variantClasses[variant]}`}
    >
      <div className="flex items-start p-4">
        <div className="flex-1">
          {title && <h3 className="font-medium">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="ml-4 inline-flex shrink-0 rounded-md p-1 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </motion.div>
  );
}
