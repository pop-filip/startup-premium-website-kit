'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ============================================================
// TOAST NOTIFICATION SYSTEM
//
// Usage:
//   1. Wrap app with <ToastProvider>
//   2. Use the hook: const { toast } = useToast();
//   3. Show toasts: toast.success('Saved!'), toast.error('Failed!')
//
// In layout.tsx:
//   <ToastProvider>
//     {children}
//   </ToastProvider>
// ============================================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

interface ToastContextValue {
  toast: {
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCount = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 5000) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = { id, type, title, message, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Max 5 toasts

    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    }
  }, [dismiss]);

  const toast = {
    success: (title: string, message?: string, duration?: number) => addToast('success', title, message, duration),
    error: (title: string, message?: string, duration?: number) => addToast('error', title, message, duration ?? 8000),
    warning: (title: string, message?: string, duration?: number) => addToast('warning', title, message, duration),
    info: (title: string, message?: string, duration?: number) => addToast('info', title, message, duration),
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}


export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToastProvider>');
  return context;
}


// ============================================================
// TOAST CONTAINER & ITEM
// ============================================================

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: string; color: string }> = {
  success: { bg: '#F0FFF4', border: '#C6F6D5', icon: '✓', color: '#22543D' },
  error:   { bg: '#FFF5F5', border: '#FED7D7', icon: '✕', color: '#742A2A' },
  warning: { bg: '#FFFAF0', border: '#FEEBC8', icon: '⚠', color: '#744210' },
  info:    { bg: '#EBF8FF', border: '#BEE3F8', icon: 'ℹ', color: '#2A4365' },
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const style = TOAST_STYLES[toast.type];
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      role="alert"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        pointerEvents: 'all',
        animation: isExiting ? 'toastOut 0.2s ease forwards' : 'toastIn 0.3s ease',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Icon */}
      <span
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: style.color,
          background: style.border,
          flexShrink: 0,
        }}
      >
        {style.icon}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: style.color }}>
          {toast.title}
        </p>
        {toast.message && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: style.color, opacity: 0.8 }}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Zatvori obaveštenje"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          fontSize: '1.1rem',
          color: style.color,
          opacity: 0.5,
          lineHeight: 1,
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>

      {/* CSS Animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
