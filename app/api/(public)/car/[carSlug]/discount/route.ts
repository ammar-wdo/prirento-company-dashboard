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


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export const POST = async (
  req: NextRequest,
  { params }: { params: { carSlug: string } }
) => {

  
  try {

    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      {
     
        return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403, statusText: "Unauthorized request",headers: corsHeaders}
      )};

    if (!params.carSlug) {
      return NextResponse.json(
        { error: "Car slug is required", success: false },
        { status: 200,headers: corsHeaders }
      );
    }

    const body = await req.json();

 
    const validBody = discountApiSchema.safeParse(body);
    if (!validBody.success) {
      for (const e of validBody.error.errors) {
        if (e.message === "Start date must be before end date") {
          return NextResponse.json(
            { error: "Date range error", success: false },
            { status: 200,headers: corsHeaders }
          );
        }
      }

      return NextResponse.json(
        { error: "Invalid inputs", success: false },
        { status: 200,headers: corsHeaders }
      );
    }

 
    const { startDate, endDate, startTime, endTime, promocode } =
      validBody.data;
     

    const startDateObject = combineDateAndTimeToUTC(startDate, startTime);
    const endDateObject = combineDateAndTimeToUTC(endDate, endTime);
    



    const discount = await prisma.carDiscount.findUnique({
      where: {
        promocode: promocode,
      },
      include: {
        car: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!discount) {
 
      return NextResponse.json(
        { discount: null, success: false, error: "Invalid promocode" },
        { status: 200 ,headers: corsHeaders}
      );
    }

    if (!discount.applyToAll && discount.car?.slug !== params.carSlug) {
      return NextResponse.json(
        {
          discount: null,
          success: false,
          error: "Discount is not applicable to this car",
        },
        { status: 200 ,headers: corsHeaders}
      );
    }

    if (
      discount.discountApplyType === "created" &&
      !(new Date() >= discount.startDate && new Date() <= discount.endDate)
    )
      return NextResponse.json({
        success: false,
        error: "This discount is not applicable for this rental dates",
        discount: null,
      },{status:200,headers: corsHeaders});

    if (
      discount.discountApplyType === "booked" &&
      !(
        startDateObject <= discount.endDate &&
        endDateObject >= discount.startDate
      )
    )
      return NextResponse.json({
        success: false,
        error: "This discount is not applicable for this rental dates",
        discount: null,
      },{status:200,headers: corsHeaders});

    const returnedDiscount = {
      id: discount.id,
      type: discount.type,
      value: discount.value,
      promocode: discount.promocode,
      discountAppliedType: discount.discountApplyType,
    };

return NextResponse.json({success:true,discount:returnedDiscount,error:''},{status:200,headers: corsHeaders})


  } catch (error: any) {
    console.log(error)
    let errorMessage = "Internal server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 ,headers: corsHeaders});
  }
};
