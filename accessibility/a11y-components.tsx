'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// ============================================================
// 1. SKIP TO MAIN CONTENT
// Place at the very top of your layout, before <header>
// ============================================================

export function SkipToMain({ 
  mainId = 'main-content',
  text = 'Skip to main content' 
}: { mainId?: string; text?: string }) {
  return (
    <a
      href={`#${mainId}`}
      className="skip-to-main"
      style={{
        position: 'absolute',
        top: '-100%',
        left: 0,
        zIndex: 9999,
        padding: '1rem 2rem',
        background: '#1B2A4A',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 600,
        textDecoration: 'none',
        borderRadius: '0 0 8px 0',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '0'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
    >
      {text}
    </a>
  );
}


// ============================================================
// 2. VISUALLY HIDDEN — For screen readers only
// ============================================================

export function VisuallyHidden({ 
  children, 
  as: Tag = 'span' 
}: { children: React.ReactNode; as?: keyof JSX.IntrinsicElements }) {
  return (
    <Tag
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Tag>
  );
}


// ============================================================
// 3. FOCUS TRAP — Keeps focus inside modals/dialogs
// ============================================================

export function FocusTrap({ 
  children, 
  active = true 
}: { children: React.ReactNode; active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!active || e.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element on mount
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled])'
    );
    firstFocusable?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, handleKeyDown]);

  return <div ref={containerRef}>{children}</div>;
}


// ============================================================
// 4. ANNOUNCE — Live region for dynamic content updates
// ============================================================

export function LiveRegion({ 
  message, 
  politeness = 'polite' 
}: { message: string; politeness?: 'polite' | 'assertive' }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </div>
  );
}


// ============================================================
// 5. useReducedMotion HOOK
// ============================================================

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}


// ============================================================
// 6. useFocusReturn HOOK — Returns focus after modal closes
// ============================================================

export function useFocusReturn(isOpen: boolean) {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);
}


// ============================================================
// 7. Accessible ICON BUTTON
// ============================================================

export function IconButton({
  label,
  onClick,
  icon,
  className = '',
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={className}
      style={{ minWidth: '44px', minHeight: '44px' }} // WCAG touch target
    >
      {icon}
      <VisuallyHidden>{label}</VisuallyHidden>
    </button>
  );
}
