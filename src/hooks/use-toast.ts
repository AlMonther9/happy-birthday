"use client";

import type React from "react";

// This is adapted from shadcn/ui toast component
import { useState, useEffect, useCallback } from "react";

export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastActionElement {
  altText: string;
  onClick: () => void;
  children: React.ReactNode;
}

export type ToastAction = ToastActionElement;

export interface ToastProps extends Toast {
  onDismiss: (id: string) => void;
  action?: ToastAction;
}

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.duration === Number.POSITIVE_INFINITY) {
        return undefined;
      }

      const timer = setTimeout(() => {
        dismiss(toast.id);
      }, toast.duration || 5000);

      return timer;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [toasts]);

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => {
      const targetToast = prevToasts.find((toast) => toast.id === id);

      if (!targetToast) {
        return prevToasts;
      }

      // Remove the toast after a delay
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, TOAST_REMOVE_DELAY);

      return prevToasts;
    });
  }, []);

  const toast = useCallback(
    ({ title, description, variant, duration = 5000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prevToasts) => {
        const newToasts = [
          { id, title, description, variant, duration },
          ...prevToasts,
        ].slice(0, TOAST_LIMIT);

        return newToasts;
      });

      return {
        id,
        dismiss: () => dismiss(id),
        update: (props: Omit<Toast, "id">) => {
          setToasts((prevToasts) => {
            const targetIndex = prevToasts.findIndex(
              (toast) => toast.id === id
            );
            if (targetIndex === -1) return prevToasts;

            const updatedToasts = [...prevToasts];
            updatedToasts[targetIndex] = {
              ...updatedToasts[targetIndex],
              ...props,
            };

            return updatedToasts;
          });
        },
      };
    },
    [dismiss]
  );

  return {
    toast,
    dismiss,
    toasts,
  };
};

export type UseToast = ReturnType<typeof useToast>;
