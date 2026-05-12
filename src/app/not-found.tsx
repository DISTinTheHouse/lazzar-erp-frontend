'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Página 404 — redirige según el estado de la sesión.
 *
 * - Autenticado → redirige al dashboard (/).
 * - No autenticado → redirige al login para evitar reactivar el ciclo:
 *   withAuth middleware → /auth/login → 404 → redirect("/") → middleware → ...
 *
 * Se implementa como Client Component con useEffect para evitar que
 * `redirect()` interrumpa el ciclo de render de React 19.2, lo cual
 * genera marcas de rendimiento (Performance Tracks) con timestamps
 * negativos en el cliente Turbopack RSC:
 *   TypeError: Failed to execute 'measure' on 'Performance':
 *   '​NotFound' cannot have a negative time stamp.
 */
export default function NotFound() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      router.replace('/');
    } else {
      router.replace('/auth/login');
    }
  }, [router, status]);

  return null;
}
