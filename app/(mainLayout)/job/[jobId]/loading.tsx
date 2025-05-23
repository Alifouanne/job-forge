import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, MapPin, Briefcase } from "lucide-react";

export default function LoadingJobPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <Skeleton className="h-8 w-64 sm:h-10 sm:w-80" />
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Skeleton className="h-5 w-32" />
                  <div className="hidden h-1 w-1 rounded-full bg-muted-foreground md:inline" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <div className="hidden h-1 w-1 rounded-full bg-muted-foreground md:inline" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>

              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          <Card className="overflow-hidden shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-lg font-medium">Job Description</h2>
            </div>
            <div className="p-5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-lg font-medium">Benefits</h2>
              <p className="text-sm text-muted-foreground">
                Highlighted benefits are offered by this company
              </p>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-7 w-24 rounded-full" />
                  ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">Apply for this position</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">Job Details</h3>
            </div>
            <div className="divide-y">
              {[
                {
                  icon: <CalendarIcon className="h-4 w-4" />,
                  label: "Apply before",
                },
                { icon: <Clock className="h-4 w-4" />, label: "Posted on" },
                {
                  icon: <Briefcase className="h-4 w-4" />,
                  label: "Employment type",
                },
                { icon: <MapPin className="h-4 w-4" />, label: "Location" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden shadow-sm">
            <div className="border-b p-5">
              <h3 className="text-lg font-medium">About the Company</h3>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
