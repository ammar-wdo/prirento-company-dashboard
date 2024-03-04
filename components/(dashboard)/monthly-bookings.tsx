import prisma from "@/lib/prisma";
import {
  bookingChangeMessage,
  cn,
  currentMonthRange,
  getCompanyEmail,
  previousMonthRange,
} from "@/lib/utils";
import React from "react";
import Widjet from "../widjet";
import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {};

const MonthlyBookings = async (props: Props) => {
  const email = await getCompanyEmail();
  const { firstDayOfCurrentMonth, firstDayOfNextMonth } = currentMonthRange();
  const { firstDayOfPreviousMonth, lastDayOfPreviousMonth } =
    previousMonthRange();

  const totalBookingsThisMonth = await prisma.booking.count({
    where: {
      car: {
        company: {
          email: email as string,
        },
      },
      bookingStatus: "ACTIVE",
      paymentStatus: "SUCCEEDED",

      startDate: {
        gte: firstDayOfCurrentMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const totalBookingsPreviousMonth = await prisma.booking.count({
    where: {
      car: {
        company: {
          email: email as string,
        },
      },
      bookingStatus: "ACTIVE",
      paymentStatus: "SUCCEEDED",

      startDate: {
        gte: firstDayOfPreviousMonth,
        lt: lastDayOfPreviousMonth,
      },
    },
  });

  const { color, message, status } = bookingChangeMessage(
    totalBookingsPreviousMonth || 0,

    totalBookingsThisMonth || 0
  );
  return (
    <Widjet title="bookings for this month">
      <div className="flex justify-between items-center">
        <span>{totalBookingsThisMonth} booking(s)</span>
        <p className={cn("flex items-center gap-1", color)}>
          {status === "increase" ? (
            <ArrowUp />
          ) : status === "decrease" ? (
            <ArrowDown />
          ) : (
            ""
          )}
          {message}
        </p>
      </div>
    </Widjet>
  );
};

export default MonthlyBookings;
