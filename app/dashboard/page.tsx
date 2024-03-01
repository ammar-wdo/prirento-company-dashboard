import BookingFeed from "@/components/(booking)/booking-feed";
import FilterComponent from "@/components/filter-component";
import Heading from "@/components/heading";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

type Props = {
  searchParams: { bookingCode: string | undefined };
};

const page = ({ searchParams }: Props) => {
  return (
    <div>
      <Heading title="Dashboard" description="General statistics" />
      <div className="mt-12  rounded-xl ">
{/* last 10 bookings */}

        <h3 className="mb-2 font-medium capitalize text-lg">
          Last 10 bookings
        </h3>
        <div className="mb-3 w-fit">
          <FilterComponent mainDahsboard={true} />
        </div>
        <div className="bg-white">
          <Suspense
            key={searchParams.bookingCode}
            fallback={
              <Skeleton className="min-h-[600px] bg-muted-foreground" />
            }
          >
            <BookingFeed
              bookingCode={searchParams.bookingCode}
              mainDashboard={true}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
