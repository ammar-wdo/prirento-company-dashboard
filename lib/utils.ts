import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "./prisma";
import { Car, CarAvailability, CarBrand, CarModel, Company } from "@prisma/client";
import { CarPublicType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function comparePasswords(plainPassword:string, hashedPassword:string) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}


export const getCompanyEmail = async()=>{
  const email = await getServerSession(authOptions).then(
    (data) => data?.user?.email
  );

  return email
}

export const getCompany = async()=>{
  const session = await getServerSession(authOptions)
  const company = await prisma.company.findUnique({
    where:{
      email:session?.user?.email as string
    }
  })

  if(!company) return null

  return company
}


export async function areIdsValid(
  ids: string[],
  model: "location" | "subLocation"
) {
  let count = 0;

  if (model === "location") {
    count = await prisma.location.count({
      where: {
        id: { in: ids },
      },
    });
  } else if (model === "subLocation") {
    count = await prisma.subLocation.count({
      where: {
        id: { in: ids },
      },
    });
  }
  if (count !== ids.length) {
    throw new Error(`${model} IDs are not valid`);
  }
}

export async function isIdValid(id: string, model: "company") {
  if (model === "company") {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new Error("Company ID is invalid");
    }
  }
}


export const checkSlug = async (
  slug: string,
  model: "company" | "car",
  id?: string
) => {
  if (model === "car") {
    const car = await prisma.car.findUnique({
      where: { slug, ...(id && { NOT: { id } }) },
    });
    if (car) {
      throw new Error("Slug already exists");
    }
  }
  if (model === "company") {
    const company = await prisma.company.findUnique({
      where: { slug, ...(id && { NOT: { id } }) },
    });
    if (company) {
      throw new Error("Slug already exists");
    }
  }
};

export const checkEmail = async (
  email: string,
  model: "company",
  id?: string
) => {
  if (model === "company") {
    const company = await prisma.company.findUnique({
      where: {
        email: email,
        ...(id && { NOT: { id } }),
      },
    });

    if (company) {
      throw new Error("Email already exists");
    }
  }
};


export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};


export const newPasswordCheck = async(newPassword:string | undefined,password:string)=>{


  let thePassword;
    if (newPassword) {
      thePassword =  await hashPassword(newPassword);
    } else {
      thePassword = password;
    }

    return thePassword
}


export const generateTimeSlots = (stepMinutes = 15) => {
  const slots = [];
  const totalMinutes = 24 * 60;
  for (let minute = 0; minute < totalMinutes; minute += stepMinutes) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }
  return slots;
}



export function combineDateAndTimeToUTC(dateString:string, timeString:string) {
  // Combine the date and time strings
  const combinedDateTimeString = `${dateString}T${timeString}:00.000Z`;

  // Create a Date object from the combined string
  const utcDate = new Date(combinedDateTimeString);

  return utcDate;
}

export function getTime(date: Date | undefined) {
  if (!date) {
    return '';
  }

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


export function generateHourlyTimes() {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    // Pad the hour with a leading zero if it's less than 10
    const formattedHour = hour.toString().padStart(2, '0');
    times.push(`${formattedHour}:00`);
  }
  return times;
}



export function convertDateToISOString(date:Date | undefined) {
  if (!date) {
    return undefined;
  }



  // Manually construct the ISO string in YYYY-MM-DD format
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad single digit month and day with leading zeros
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');

  return `${year}-${paddedMonth}-${paddedDay}`;

}


export function formatDate(
  date: Date,
  locale: string = 'en-GB',
  options: Intl.DateTimeFormatOptions & { timeZone: string } = {
    timeZone: 'UTC', // Ensuring timezone is always included in the options
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  }
): string {
  // Merge default options with any user-provided options
  const mergedOptions: Intl.DateTimeFormatOptions = { ...options };

  return new Intl.DateTimeFormat(locale, mergedOptions).format(date);
}

export function calculateRentalPeriod(startDate: Date, endDate: Date): { days: number, extraHours: number } {
  // Calculate the total difference in milliseconds
  const diffMs = endDate.getTime() - startDate.getTime();
  
  // Convert milliseconds to hours and days
  const hoursTotal = diffMs / (1000 * 60 * 60);
  const days = Math.floor(hoursTotal / 24);
  const extraHours = Math.floor(hoursTotal % 24);
  
  return { days, extraHours };
}

export function calculateTotalRentalPriceWithAvailability(
  startDate: Date, 
  endDate: Date,
  pricings: number[], 
  hourlyPrice: number | null | undefined
): { totalPrice: number | null, isAvailable: boolean, rentalPeriodDescription: string } {
  const { days, extraHours } = calculateRentalPeriod(startDate, endDate);

  if ((days > 0 && !pricings[days - 1]) || !hourlyPrice) {
    return { isAvailable: false, totalPrice: null, rentalPeriodDescription: "Not available" };
  }

  // Calculate day price
  const dayPrice = days > 0 ? pricings[days - 1] : 0;

  // Calculate price for extra hours, if hourly price is specified
  const extraHoursPrice = hourlyPrice ? extraHours * hourlyPrice : 0;
  
  // Sum day price and extra hours price to get total price
  const totalPrice = dayPrice + extraHoursPrice;

  // Generate rental period description
  let rentalPeriodDescription = '';
  if (days > 0) {
    rentalPeriodDescription += `${days} day${days > 1 ? 's' : ''}`;
  }
  if (extraHours > 0) {
    rentalPeriodDescription += (days > 0 ? ' and ' : '') + `${extraHours} hour${extraHours > 1 ? 's' : ''}`;
  }

  return { totalPrice, isAvailable: true, rentalPeriodDescription };
}




export function processCars(
  cars: (Car &{availabilities:CarAvailability[],carModel:CarModel & {carBrand:{brand:string}},company:{logo:string}})[] ,
  startDateObject: Date,
  endDateObject: Date
): { availableCars: CarPublicType[], notAvailableCars: CarPublicType[] } {

  const allCars = cars.map(car => {
    const { totalPrice, isAvailable,rentalPeriodDescription } = calculateTotalRentalPriceWithAvailability(
      startDateObject,
      endDateObject,
      car.pricings,
      car.hourPrice
    );

    const notAvailable = !isAvailable || car.availabilities.length > 0;

    return {
      id: car.id,
      carName: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
      year: car.year,
      seats: car.seats,
      kmIncluded: car.kmIncluded,
      carType: car.carType,
      gallary: car.gallary, 
      transmition: car.transmition, 
      availablePrice: totalPrice,
      companyLogo: car.company.logo,
      notAvailable,
      period:rentalPeriodDescription
    };
  });


  const availableCars = allCars.filter(car => !car.notAvailable);
  const notAvailableCars = allCars.filter(car => car.notAvailable);

  return { availableCars, notAvailableCars }}