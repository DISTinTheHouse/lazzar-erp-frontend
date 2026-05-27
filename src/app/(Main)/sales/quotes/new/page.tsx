import { Metadata } from "next";
import QuoteForm from "@/src/features/quotes/components/QuoteForm";

export const metadata: Metadata = {
  title: "Nueva Cotización | ERP",
  description:
    "Crea una nueva cotización con información de cliente, productos y montos en el ERP.",
  openGraph: {
    title: "Nueva Cotización | ERP",
    description:
      "Crea una nueva cotización con información de cliente, productos y montos en el ERP.",
    type: "website",
  },
};

export default function QuotesNewPage() {
  return (
    <div className="w-full space-y-6 pt-2">
      <QuoteForm />
    </div>
  );
}
