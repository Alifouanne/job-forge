import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const JobListingsLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div>
          <Skeleton className="size-14  rounded" />
        </div>
      </Card>
    </div>
  );
};

export default JobListingsLoading;
