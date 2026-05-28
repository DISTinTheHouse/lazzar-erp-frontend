'use client';

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { RadixThemeWrapper } from "@/src/components/RadixThemeWrapper";

export function SessionThemeProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <RadixThemeWrapper>{children}</RadixThemeWrapper>
    </SessionProvider>
  );
}