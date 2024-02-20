import prisma from "@/lib/prisma";
import {
  calculateTotalRentalPriceWithAvailability,
  combineDateAndTimeToUTC,
  doesOverlap,
  formatDate,
  isCarAvailable,
} from "@/lib/utils";
import { FilterOneCarSchema, discountApiSchema } from "@/schemas";

import { NextRequest, NextResponse } from "next/server";
import qs from "query-string";

export const revalidate = 0;

export const POST = async (
  req: NextRequest,
  { params }: { params: { carSlug: string } }
) => {
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403, statusText: "Unauthorized request" }
      );

    if (!params.carSlug) {
      return NextResponse.json(
        { error: "Car slug is required", success: false },
        { status: 200 }
      );
    }

    const body = await req.json();

    const validBody = discountApiSchema.safeParse(body);
    if (!validBody.success) {
      for (const e of validBody.error.errors) {
        if (e.message === "Start date must be before end date") {
          return NextResponse.json(
            { error: "Date range error", success: false },
            { status: 200 }
          );
        }
      }

      return NextResponse.json(
        { error: "Invalid inputs", success: false },
        { status: 200 }
      );
    }
    const { startDate, endDate, startTime, endTime, promocode } =
      validBody.data;


    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);

const discount = await prisma.carDiscount.findUnique({
    where:{
        promocode:promocode
    },include:{
        car:{
            select:{
                slug:true
            }
        }
    }
})



if(!discount) {
    return NextResponse.json({ discount: null, success: false,message:'Invalid promocode' }, { status: 200 });
}

if(!discount.applyToAll && discount.car?.slug !== params.carSlug) {
    return NextResponse.json({ discount: null, success: false,message:'Discount is not applicable to this car' }, { status: 200 });
}





const returnedDiscount = {
    id:discount.id,
    type:discount.type,
    value:discount.value,
    promocode:discount.promocode,
    appliedType:discount.discountApplyType
}




  
  } catch (error: any) {
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
