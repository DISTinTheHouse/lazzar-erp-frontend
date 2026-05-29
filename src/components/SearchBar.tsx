"use client";

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "./Icons";


export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enfocar el input al expandir, con retardo para que la animación inicie primero
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(id);
  }, [isOpen]);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Cerrar al presionar Escape
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      role="search"
      aria-label="Barra de búsqueda"
      onKeyDown={handleKeyDown}
      className={[
        "flex items-center h-10 rounded-full border transition-all duration-300 ease-in-out overflow-hidden",
        isOpen
          ? "w-64 bg-white dark:bg-zinc-900 shadow-xl border-slate-100 dark:border-slate-800"
          : "w-10 bg-transparent border-transparent",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label={isOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
        aria-expanded={isOpen}
        aria-controls="search-input"
        title="Buscar"
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          "shrink-0 h-10 w-10 flex items-center justify-center transition-colors cursor-pointer",
          isOpen ? "text-sky-600" : "text-slate-400 hover:text-sky-600",
        ].join(" ")}
      >
        <SearchIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        aria-label="Buscar en el sistema"
        tabIndex={isOpen ? 0 : -1}
        className={[
          "h-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm pr-4 text-slate-600 dark:text-white placeholder-slate-400 transition-opacity duration-200",
          isOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none",
        ].join(" ")}
        placeholder="Buscar en el sistema..."
      />
    </div>
  );
};
