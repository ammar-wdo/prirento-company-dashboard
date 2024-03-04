import React from "react";
import FullCalendarComponent from "./car-full-calendar";
import prisma from "@/lib/prisma";
import { getCompanyEmail } from "@/lib/utils";

type Props = {
  carId: string;
};

const FullCalendarServerWrapper = async ({ carId }: Props) => {

    //fetch company email
  const email = await getCompanyEmail();

//calculate 3 monthes befor now and three monthes after now
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(now.getMonth() + 3);

//fetching bookings in this range
  const bookingsRes = prisma.booking.findMany({
    where: {
      carId,
      car: { company: { email: email as string } },
      OR: [
        {
          startDate: {
            gte: threeMonthsAgo,
            lte: threeMonthsFromNow,
          },
        },
        {
          endDate: {
            gte: threeMonthsAgo,
            lte: threeMonthsFromNow,
          },
        },
      ],
    },
    select: {
      startDate: true,
      endDate: true,
      id: true,
    },
  });
  
  //fetching availabilites in this range
  const availabilitiesRes = prisma.carAvailability.findMany({
    where: {
      carId,
      car: { company: { email: email as string } },
      OR: [
        {
          startDate: {
            gte: threeMonthsAgo,
            lte: threeMonthsFromNow,
          },
        },
        {
          endDate: {
            gte: threeMonthsAgo,
            lte: threeMonthsFromNow,
          },
        },
      ],
    },
    select: {
      startDate: true,
      endDate: true,
      id: true,
    },
  });

  const [bookings, availabilities] = await Promise.all([
    bookingsRes,
    availabilitiesRes,
  ]);

  return (
    <div>
      <FullCalendarComponent
        bookings={bookings}
        availabilities={availabilities}
      />
    </div>
  );
};

export default FullCalendarServerWrapper;
