import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Clock, MapPin } from "lucide-react";

export default function LoadingFavorites() {
  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <SkeletonJobCard key={index} />
        ))}
    </div>
  );
}

function SkeletonJobCard() {
  return (
    <Card className="overflow-hidden border bg-card p-0 shadow-sm">
      <div className="relative">
        {/* Subtle highlight bar at the top */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary/80 to-primary/30" />

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Company Logo */}
            <div className="relative">
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>

            {/* Job Details */}
            <div className="flex-1">
              <Skeleton className="mb-1 h-6 w-3/4" />

              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <Skeleton className="h-4 w-24" />
                <span className="hidden text-xs text-muted-foreground/50 sm:inline-block">
                  •
                </span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <div className="flex items-center rounded-full border px-2 py-1 text-xs">
                  <Briefcase className="mr-1 h-3 w-3 text-muted-foreground" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="rounded-full border px-2 py-1 text-xs">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Posted Time */}
            <div className="mt-2 flex items-center text-xs text-muted-foreground sm:mt-0 sm:block sm:text-right">
              <Clock className="mr-1 inline h-3 w-3 sm:mr-0 text-muted-foreground" />
              <Skeleton className="h-3 w-16 sm:mt-1" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
