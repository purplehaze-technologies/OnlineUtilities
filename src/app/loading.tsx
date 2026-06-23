import { Skeleton } from "@/components/ui/skeleton";

/** Global route-level loading state shown during navigation/streaming. */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
