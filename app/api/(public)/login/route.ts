import { CustomError } from "@/costum-error";
import prisma from "@/lib/prisma";
import { clientLoginSchema } from "@/schemas";
import { NextResponse } from "next/server";

export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: Request) => {
  console.log("login");
  try {
    const apiSecret = req.headers.get("api-Secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET)
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 403, statusText: "Unauthorized request" }
      );

    const body = await req.json();

    const validDate = clientLoginSchema.safeParse(body);
    if (!validDate.success) throw new CustomError("Invalid inputs");

    const { email, bookingCode } = validDate.data;
    const booking = await prisma.booking.findUnique({
      where: {
        email:email.toLocaleLowerCase(),
        bookingCode,
        paymentStatus:'SUCCEEDED',

      },include:{
        car:{
            select:{
                carModel:{
                    select:{
                        name:true,
                        carBrand:{
                            select:{brand:true}
                        }
                    }
                }
            }
        }
      }
    });


    if (!booking) throw new CustomError("Invalid Credentials");
    const carName = booking.car.carModel.carBrand.brand + ' ' +  booking.car.carModel.name

    const {id,car,carId,updatedUt,...rest} = booking

    const returnedBooking = {carName,...rest}

    return NextResponse.json({ success: true, booking:returnedBooking }, { status: 200,headers:corsHeaders });
  } catch (error) {
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message, booking: null },
      { status: 200 }
    );
  }
};
