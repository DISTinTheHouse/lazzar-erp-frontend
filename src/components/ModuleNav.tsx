"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { appRouteGroups } from "@/src/constants/appRoutes";
import { hasPermission } from "@/src/utils/permissions";

interface ModuleNavProps {
  moduleKey?: string;
  modulePath?: string;
  className?: string;
}

export default function ModuleNav({ moduleKey, modulePath, className }: ModuleNavProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const activeGroup = moduleKey
    ? appRouteGroups.find((group) => group.key === moduleKey)
    : modulePath
      ? appRouteGroups.find(
          (group) =>
            group.modulePath === modulePath || modulePath.startsWith(`${group.modulePath}/`)
        )
      : appRouteGroups.find(
          (group) =>
            pathname === group.modulePath || pathname.startsWith(`${group.modulePath}/`)
        );

  if (!activeGroup) {
    return null;
  }

  const visibleRouteItems = activeGroup.items.filter(
    (item) => item.showInSidebar !== false
  );

  const tabs = [
    {
      label: activeGroup.moduleLabel,
      href: activeGroup.modulePath,
      isRoot: true,
    },
    ...visibleRouteItems
      .filter((item) => (item.permission ? hasPermission(item.permission, session?.user) : true))
      .map((item) => ({
        label: item.label,
        href: item.path,
        isRoot: false,
      })),
  ];
  const loadingTabPlaceholders = Array.from({
    length: Math.max(1, visibleRouteItems.length),
  });

  const isActive = (href: string, isRoot: boolean) =>
    isRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Navegación del módulo"
      aria-busy={status === "loading"}
      className={`w-full min-h-12 border-b border-slate-200/70 dark:border-white/10 ${className ?? ""}`}
    >
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex min-h-12 items-end gap-4 sm:gap-6 flex-nowrap">
          {status === "loading" ? (
            <>
              <span className="shrink-0 pb-3 text-sm font-semibold text-sky-600 dark:text-sky-300 border-b-2 border-sky-500 dark:border-sky-400">
                {activeGroup.moduleLabel}
              </span>
              {loadingTabPlaceholders.map((_, index) => (
                <div
                  key={`module-nav-skeleton-${activeGroup.key}-${index}`}
                  className={`shrink-0 pb-3 ${index % 2 === 0 ? "w-24" : "w-20"}`}
                  aria-hidden="true"
                >
                  <LoadingSkeleton className="h-4 rounded-full" />
                </div>
              ))}
            </>
          ) : (
            tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive(tab.href, tab.isRoot) ? "page" : undefined}
                className={`shrink-0 pb-3 text-sm font-semibold transition-colors border-b-2 ${
                  isActive(tab.href, tab.isRoot)
                    ? "text-sky-600 dark:text-sky-300 border-sky-500 dark:border-sky-400"
                    : "text-slate-500 dark:text-slate-400 border-transparent hover:text-sky-600 dark:hover:text-sky-300"
                }`}
              >
                {tab.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
