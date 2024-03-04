import React from "react";
import Widjet from "../widjet";
import { currentMonthRange, getCompanyEmail } from "@/lib/utils";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Props = {};

const MostRentedCar = async (props: Props) => {
  const email = await getCompanyEmail();

  const { firstDayOfCurrentMonth, firstDayOfNextMonth } = currentMonthRange();
  const mostBookedCarThisMonth = await prisma.booking.groupBy({
    by: ["carId"],
    _count: true,
    where: {
      startDate: {
        gte: firstDayOfCurrentMonth,
        lt: firstDayOfNextMonth,
      },
      bookingStatus: "ACTIVE",
      paymentStatus: "SUCCEEDED",
      car: {
        company: {
          email: email as string,
        },
      },
    },
    orderBy: {
      _count: {
        carId: "desc",
      },
    },
    take: 1,
  });
  let carDetails = null;
  if (mostBookedCarThisMonth.length > 0) {
    const carId = mostBookedCarThisMonth[0].carId;
    carDetails = await prisma.car.findUnique({
      where: {
        id: carId,
      },
      select: {
        id: true,
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
    });

    const totalAmount = await prisma.booking.aggregate({
      _sum: {
        payLater: true, // Assuming 'total' is the field that stores the booking's amount
      },
      where: {
        carId: carId,
        car: {
          company: {
            email: email as string,
          },
        },
        startDate: {
          gte: firstDayOfCurrentMonth,
        },
        endDate: {
          lt: firstDayOfNextMonth,
        },
        bookingStatus: "ACTIVE",
        paymentStatus: "SUCCEEDED",
      },
    });

    return (
      <Widjet title="Most rented car for this month">
        {carDetails ? (
          <div>
            <Link href={`/dashboard/cars/${carDetails.id}` } className="capitalize">
              {carDetails.carModel.carBrand.brand} {carDetails.carModel.name}
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-bold">AED</span>
              {totalAmount._sum.payLater?.toFixed(2)}
            </div>
          </div>
        ) : (
          <p>N/A</p>
        )}
      </Widjet>
    );
  }
};

export default MostRentedCar;
