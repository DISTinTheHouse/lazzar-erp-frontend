import ModuleNav from "@/src/components/ModuleNav";

export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full space-y-6">
      <ModuleNav moduleKey="system" />
      {children}
    </div>
  );
}
