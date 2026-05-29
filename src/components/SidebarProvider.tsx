"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Interfaz del contexto ────────────────────────────────────────────────────

interface SidebarContextType {
  /** Indica si el sidebar está anclado (expandido de forma permanente). */
  isPinned: boolean;
  /** Alterna entre estado anclado y no anclado. */
  togglePin: () => void;
}

// ─── Contexto con valores por defecto ─────────────────────────────────────────

const SidebarContext = createContext<SidebarContextType>({
  isPinned: false,
  togglePin: () => {},
});

// ─── Hook público para consumir el contexto ───────────────────────────────────

export const useSidebar = () => useContext(SidebarContext);

// ─── Proveedor ────────────────────────────────────────────────────────────────

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);

  const togglePin = () => setIsPinned((prev) => !prev);

  return (
    <SidebarContext value={{ isPinned, togglePin }}>
      {children}
    </SidebarContext>
  );
}
