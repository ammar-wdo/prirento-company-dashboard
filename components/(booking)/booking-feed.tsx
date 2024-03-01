import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { getCompanyEmail } from "@/lib/utils";
import { getServerSession } from "next-auth";
import React from "react";
import NoResult from "../no-result";
import { DataTable } from "./booking-table";
import { columns } from "./culomns";

type Props = {
  bookingCode:string | undefined,page:string | undefined
};

const BookingFeed = async ({bookingCode,page}: Props) => {
  const email = await getCompanyEmail();

  const bookings = await prisma.booking.findMany({
    where: {
      ...(bookingCode && {bookingCode}),
      car: {
        company: {
          email: email as string,
        },
      },
    },
    include: {
      car: {
        select: {
          carModel: {
            select: {
              name: true,
              carBrand: {
                select: {
                  brand: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return <DataTable columns={columns} data={bookings} />;
};

export default BookingFeed;
