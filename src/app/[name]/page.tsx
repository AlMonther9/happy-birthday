import { Suspense } from "react";
import BirthdayCard from "@/components/birthday-card";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NamePageProps {
  params: {
    name: string;
  };
  searchParams: {
    gender?: string;
  };
}

export default function NamePage({ params, searchParams }: NamePageProps) {
  // Decode the URL-encoded name
  const decodedName = decodeURIComponent(params.name);
  const gender = searchParams.gender === "female" ? "female" : "male";

  // Validate the name (optional)
  if (!decodedName || decodedName.length > 50) {
    return notFound();
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 overflow-hidden">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            <div className="text-center text-pink-600">
              جاري تحضير الاحتفال...
            </div>
          </div>
        }
      >
        <BirthdayCard name={decodedName} gender={gender} />
      </Suspense>
    </main>
  );
}
