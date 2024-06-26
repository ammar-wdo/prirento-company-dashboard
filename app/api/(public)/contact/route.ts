import { CustomError } from "@/costum-error";
import { contactSchema } from "@/schemas";
import { NextResponse } from "next/server";
import axios from 'axios'


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
    console.log('hi')
  try {
    const apiSecret = req.headers.get("api-Secret"); //API secret key to prevent 3rd party requests

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      throw new CustomError("Unauthorized request");
    }

    const body = await req.json();
    const validData = contactSchema.safeParse(body);
    if (!validData.success) throw new CustomError("Invalid inputs");

   await axios.post("https://webhooks.integrately.com/a/webhooks/16d9df74283b4cf8b2ac5da7d8b8e8c7",validData.data)

    return NextResponse.json({
      success: true,
      message:'Successfully sent',
    });
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;
    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
};
