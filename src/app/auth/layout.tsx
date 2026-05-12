/**
 * Layout de autenticación — solo envuelve los hijos con el estilo visual.
 *
 * La redirección "si ya hay sesión → ir al dashboard" se maneja en cada
 * página hija (ej. login/page.tsx) para evitar el ciclo infinito:
 *   withAuth middleware → /auth/login → layout redirect("/") → middleware → ...
 * El middleware garantiza que rutas protegidas requieran sesión válida.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen flex items-center justify-center transition-colors duration-300 relative selection:bg-sky-500 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(110%_70%_at_50%_-10%,rgba(56,189,248,0.28),rgba(255,255,255,0))] dark:bg-[radial-gradient(120%_85%_at_50%_-20%,rgba(56,189,248,0.22),rgba(17,17,19,0))]"></div>
      {children}
    </div>
  );
}
