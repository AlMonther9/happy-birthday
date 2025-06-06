import { Suspense } from "react";
import BirthdayCard from "@/components/birthday-card";
import { Loader2 } from "lucide-react";

export default function Home() {
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
        <BirthdayCard />
      </Suspense>
    </main>
  );
}
