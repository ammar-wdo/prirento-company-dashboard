import BookingFeed from "@/components/(booking)/booking-feed";
import MonthlyBookings from "@/components/(dashboard)/monthly-bookings";
import MonthlyRevenue from "@/components/(dashboard)/monthly-revenue";
import MostRentedCar from "@/components/(dashboard)/most-rented-car";
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
        {/* widjets */}
        <div className="grid grid-cols-1   lg:grid-cols-2  2xl:grid-cols-3  gap-4">
          <Suspense fallback={<Skeleton className="h-[150px]"/>}>
          <MonthlyRevenue/>
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[150px]"/>}>
          <MostRentedCar />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[150px]"/>}>
          <MonthlyBookings />
          </Suspense>
   
        </div>
  

        
{/* last 10 bookings */}
<div className="mt-12">
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
              <Skeleton className="min-h-[600px]" />
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
    </div>
  );
};

export default page;
