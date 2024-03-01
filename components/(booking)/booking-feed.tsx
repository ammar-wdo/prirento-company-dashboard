import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { getCompanyEmail } from "@/lib/utils";
import { getServerSession } from "next-auth";
import React from "react";
import NoResult from "../no-result";
import { DataTable } from "./booking-table";
import { columns } from "./culomns";

type Props = {
  bookingCode:string | undefined,page?:string | undefined
  mainDashboard?:boolean
};

const BookingFeed = async ({bookingCode,page,mainDashboard}: Props) => {
  const email = await getCompanyEmail();

  const bookings = await prisma.booking.findMany({
...(mainDashboard && {take:10}),
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
    orderBy:{
      createdAt:'desc'
    }
  });

  return <DataTable columns={columns} data={bookings} />;
};

export default BookingFeed;
