import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "./prisma";
import jwt from 'jsonwebtoken';
import {

  Car,


  CarModel,

  SuperadminRule,
} from "@prisma/client";
import { CarPublicType } from "@/types";
import { CustomError } from "@/costum-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}

export const getCompanyEmail = async () => {
  const email = await getServerSession(authOptions).then(
    (data) => data?.user?.email
  );

  return email;
};

export const getCompany = async () => {
  const session = await getServerSession(authOptions);
  const company = await prisma.company.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (!company) return null;

  return company;
};

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

export const newPasswordCheck = async (
  newPassword: string | undefined,
  password: string
) => {
  let thePassword;
  if (newPassword) {
    thePassword = await hashPassword(newPassword);
  } else {
    thePassword = password;
  }

  return thePassword;
};

export const generateTimeSlots = (stepMinutes = 15) => {
  const slots = [];
  const totalMinutes = 24 * 60;
  for (let minute = 0; minute < totalMinutes; minute += stepMinutes) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  }
  return slots;
};

export function combineDateAndTimeToUTC(
  dateString: string,
  timeString: string
) {
  // Combine the date and time strings
  const combinedDateTimeString = `${dateString}T${timeString}:00.000Z`;

  // Create a Date object from the combined string
  const utcDate = new Date(combinedDateTimeString);

  return utcDate;
}

export function getTime(date: Date | undefined) {
  if (!date) {
    return "";
  }

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function generateHourlyTimes() {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    // Pad the hour with a leading zero if it's less than 10
    const formattedHour = hour.toString().padStart(2, "0");
    times.push(`${formattedHour}:00`);
  }
  return times;
}

export function convertDateToISOString(date: Date | undefined) {
  if (!date) {
    return undefined;
  }

  // Manually construct the ISO string in YYYY-MM-DD format
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad single digit month and day with leading zeros
  const paddedMonth = month.toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
}

export function formatDate(
  date: Date,
  locale: string = "en-GB",
  options: Intl.DateTimeFormatOptions & { timeZone: string } = {
    timeZone: "UTC", // Ensuring timezone is always included in the options
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  }
): string {
  // Merge default options with any user-provided options
  const mergedOptions: Intl.DateTimeFormatOptions = { ...options };

  return new Intl.DateTimeFormat(locale, mergedOptions).format(date);
}

export const calculateHours = (startDate: Date, endDate: Date) => {
  const diffMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to hours and days
  const hoursTotal = diffMs / (1000 * 60 * 60);

  return hoursTotal;
};

export function calculateRentalPeriod(
  startDate: Date,
  endDate: Date
): { days: number; extraHours: number } {
  // Calculate the total difference in milliseconds
  const diffMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to hours and days
  const hoursTotal = calculateHours(startDate, endDate);
  const days = Math.floor(hoursTotal / 24);
  const extraHours = Math.floor(hoursTotal % 24);

  return { days, extraHours };
}

export function calculateTotalRentalPriceWithAvailability(
  startDate: Date,
  endDate: Date,
  pricings: number[],
  hourlyPrice: number | null | undefined
): {
  totalPrice: number | null;
  isAvailable: boolean;
  rentalPeriodDescription: string;
} {
  const { days, extraHours } = calculateRentalPeriod(startDate, endDate);

  // Generate rental period description
  let rentalPeriodDescription = "";

  if (days > 0) {
    rentalPeriodDescription += `${days} day${days > 1 ? "s" : ""}`;
  }
  if (extraHours > 0) {
    rentalPeriodDescription +=
      (days > 0 ? " and " : "") +
      `${extraHours} hour${extraHours > 1 ? "s" : ""}`;
  }

  if ((days > 0 && !pricings[days - 1]) || !hourlyPrice) {
    return {
      isAvailable: false,
      totalPrice: null,
      rentalPeriodDescription,
    };
  }

  // Calculate day price
  const dayPrice = days > 0 ? pricings[days - 1] : 0;

  // Calculate price for extra hours, if hourly price is specified
  const extraHoursPrice = hourlyPrice ? extraHours * hourlyPrice : 0;

  // Sum day price and extra hours price to get total price
  const totalPrice = dayPrice + extraHoursPrice;

  return { totalPrice, isAvailable: true, rentalPeriodDescription };
}

export function processCars(
  cars: (Car & {
    availabilities: {
      startDate: Date;
      endDate: Date;
    }[];
    bookings: {
      startDate: Date;
      endDate: Date;
    }[];
    carModel: CarModel & { carBrand: { brand: string } };
    company: { logo: string,slug:string };
  })[],
  startDateObject: Date,
  endDateObject: Date
): { availableCars: CarPublicType[]; notAvailableCars: CarPublicType[] } {
  const allCars = cars.map((car) => {
    const { totalPrice, isAvailable, rentalPeriodDescription } =
      calculateTotalRentalPriceWithAvailability(
        startDateObject,
        endDateObject,
        car.pricings,
        car.hourPrice
      );

    //check if chosen hours bigger than minimum hour rate
    const hours = calculateHours(startDateObject, endDateObject);
    const minHoursValid = car.minimumHours ? car.minimumHours < hours : true;
    //check availability in case (price is not available for chosen dates - there are any availability blocking dates - minimum rentung hours are gigger than chosen date's hours)
    const notAvailable =
      !isAvailable ||
      car.availabilities.length > 0 ||
      car.bookings.length > 0 ||
      !minHoursValid;

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
      companySlug:car.company.slug,
      notAvailable,
      period: rentalPeriodDescription,
      slug: car.slug as string,
    };
  });

  const availableCars = allCars.filter((car) => !car.notAvailable);
  const notAvailableCars = allCars.filter((car) => car.notAvailable);

  return { availableCars, notAvailableCars };
}

export type Description = "2 seats" | "4+ seats" | "2 doors" | "4+ doors";

export function mapDescriptionsToNumbers(
  descriptions: Description[] | Description | undefined
): number[] {
  let numbers: number[] = [];
  console.log("descriptions", descriptions);

  // Process each description and map it to the corresponding numbers

  if (Array.isArray(descriptions)) {
    descriptions.forEach((description) => {
      switch (description) {
        case "2 seats":
        case "2 doors":
          numbers.push(2);
          break;
        case "4+ seats":
        case "4+ doors":
          numbers.push(...[4, 5, 6, 7]);
          break;
      }
    });
  }

  switch (descriptions) {
    case "2 seats":
    case "2 doors":
      numbers.push(2);
      break;
    case "4+ seats":
    case "4+ doors":
      numbers.push(...[4, 5, 6, 7]);
      break;
  }

  // Remove duplicates by converting the numbers array to a Set, then back to an array
  const uniqueNumbers = Array.from(new Set(numbers));

  // Sort the numbers in ascending order
  return uniqueNumbers.sort((a, b) => a - b);
}

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export function doesOverlap(
  clientStartDate: Date,
  clientEndDate: Date,
  dateRanges: DateRange[]
): boolean {
  return dateRanges.some(({ startDate, endDate }) => {
    // Check if the client's date range overlaps with the current date range in the array
    return clientStartDate <= endDate && clientEndDate >= startDate;
  });
}

type IsCarAvailable = {
  priceAvailability: boolean;
  location: string;
  carPickLocations: { slug: string; name: string }[] | [];
  carDropLocations: { slug: string; name: string }[] | [];
  dropOffLocation: string | undefined;
  availabilityRangeDates: { startDate: Date; endDate: Date }[] | [];
  bookingsRangeDates: { startDate: Date; endDate: Date }[] | [];
  clientStartDate: Date;
  clientEndDate: Date;
  validHours:
    | { valid: true; minimumHours: null }
    | { valid: false; minimumHours: number };
  fee: number | false;
};

export const isCarAvailable = ({
  priceAvailability,
  location,
  dropOffLocation,
  availabilityRangeDates,
  bookingsRangeDates,
  clientEndDate,
  clientStartDate,
  carPickLocations,
  carDropLocations,
  validHours,
  fee,
}: IsCarAvailable): {
  isAvailable: boolean;
  message: string;
  pickupLocations: string;
  dropOffLocations: string;
  reservationDates:{startDate:Date,endDate:Date}[]
} => {
  let isAvailable = true;
  let message = "";
  let pickupLocations = "";
  let dropOffLocations = "";
  let reservationDates:{startDate:Date,endDate:Date}[] =[]

  const isPickupLocationAvailable = carPickLocations.some(
    (el) => el.slug.toLocaleLowerCase() === location.toLocaleLowerCase()
  );

  const isDropOffLocationAvailable = dropOffLocation
    ? carDropLocations.some(
        (el) =>
          el.slug.toLocaleLowerCase() === dropOffLocation.toLocaleLowerCase()
      )
    : true;

  // const availabilityOverLap = doesOverlap(clientStartDate, clientEndDate, availabilityRangeDates);
  // const bookingsOverLap = doesOverlap(clientStartDate, clientEndDate, bookingsRangeDates);


  if (!!bookingsRangeDates.length) {
    isAvailable = false;
    message = "This car is already booked for these dates:";
    reservationDates = bookingsRangeDates
  }


  if (!priceAvailability || !!availabilityRangeDates.length) {
    isAvailable = false;
    message = "This car is not available for this chosen date and time";
    reservationDates=[]
  }


  if (!!priceAvailability && fee === false) {
    isAvailable = false;
    message = `Car is not available`;
    reservationDates=[]
  }

  if (!validHours.valid) {
    isAvailable = false;
    message = `This car is available for minimum of  ${validHours.minimumHours} hour(s) rent`;
    reservationDates=[]
  }

  if (!isPickupLocationAvailable || !isDropOffLocationAvailable) {
    isAvailable = false;
    message = "This car is only available in:";
    pickupLocations = carPickLocations.map((el) => el.name).join(", ");
    dropOffLocations = carDropLocations.map((el) => el.name).join(", ");
    reservationDates=[]
  }

  return { isAvailable, message, pickupLocations, dropOffLocations, reservationDates };
};

export const calculateDiscount = (
  fee: number,
  type: "fixed" | "percentage",
  value: number
) => {
  const val = type === "fixed" ? value : (value * fee) / 100;

  return val;
};

export const calculateReservationFee = (
  reservationPercentage: number | null,
  reservationFlat: number | null,
  subtotal: number
) => {
  let value: number | boolean;

  if (!!reservationPercentage) {
    value = (reservationPercentage * subtotal) / 100;
  } else if (!!reservationFlat) {
    if (reservationFlat >= subtotal) {
      value = false;
    } else {
      value = reservationFlat;
    }
  } else {
    value = false;
  }

  return value;
};

export const checkDiscount = async (
  promocode: string,
  carSlug: string,
  startDateObject: Date,
  endDateObject: Date,
  reservationFee: number
) => {
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
  const currentDatePlus4Hours = new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
  console.log("date",currentDatePlus4Hours);
  if (!discount) {
    throw new CustomError("Invalid promocode");
  }

  if (!discount.applyToAll && discount.car?.slug !== carSlug) {
    throw new CustomError("Discount is not applicable to this car");
  }

  if (
    discount.discountApplyType === "created" &&
    !(currentDatePlus4Hours >= discount.startDate && currentDatePlus4Hours <= discount.endDate)
  ) {
    throw new CustomError(
      "This discount is not applicable for this rental dates"
    );
  }

  if (
    discount.discountApplyType === "booked" &&
    !(
      startDateObject <= discount.endDate && endDateObject >= discount.startDate
    )
  ) {
    throw new CustomError(
      "This discount is not applicable for this rental dates"
    );
  }

  const discountValue = calculateDiscount(
    reservationFee,
    discount.type,
    discount.value
  );

  if (discountValue >= reservationFee) {
    throw new CustomError("Promocode is not applicable");
  }
  return {
    id: discount.id,
    type: discount.type,
    value: discount.value,
    promocode: discount.promocode,
    discountAppliedType: discount.discountApplyType,
  };
};

export const calculateExtraOptionsAndPrice = async (
  carExtraOptionsIds: string[] | null
) => {
  let carExtraOptions = null;
  let carExtraOptionsPrice = 0;
  if (
    !!carExtraOptionsIds &&
    Array.isArray(carExtraOptionsIds) &&
    !!carExtraOptionsIds.length
  ) {
    carExtraOptions = await prisma.carExtraOption.findMany({
      where: {
        id: {
          in: carExtraOptionsIds,
          
        },
        status:'active'
      },
    });

    carExtraOptionsPrice = carExtraOptions.reduce(
      (acc, value) => acc + value.price,
      0
    );
  }
  return { carExtraOptions, carExtraOptionsPrice };
};

export const isDeliveryFee = (
  dropOffLocation: string | undefined,
  location: string
) => (dropOffLocation && dropOffLocation !== location) || false;

export const extractPayments = ({
  totalPrice,
  carDeposit,
  carExtraOptionsPrice,
  deliveryFee,
  discountValue,
  reservationFee,
  mandatoryRulesPrice,
  optionalRulesPrice,
}: {
  totalPrice: number;
  carDeposit: number;
  carExtraOptionsPrice: number;
  deliveryFee: number;
  discountValue: number;
  reservationFee: number;
  mandatoryRulesPrice: number;
  optionalRulesPrice: number;
}) => {
  //calculate total amount
  const totalAmount =
    (totalPrice as number) +
    carDeposit +
    carExtraOptionsPrice +
    mandatoryRulesPrice +
    optionalRulesPrice +
    deliveryFee -
    discountValue;

  //calculate checkout payment
  const checkoutPayment = reservationFee - discountValue;

  //calculate the remaining value after substracting our value (the payNow value)
  const payLater = totalAmount - checkoutPayment;

  return { totalAmount, checkoutPayment, payLater };
};

//return super admin rule with the value property to pay
export const extractsuperadminRuleWithValueToPay = (
  superAdminRule: SuperadminRule,
  priceValue: number
) => {
  const valueToPay =
    superAdminRule.type === "percentage"
      ? (superAdminRule.value * priceValue) / 100
      : superAdminRule.value;

  return { ...superAdminRule, valueToPay };
};

//extract admin rules arrays (mandatory and optional) and the accumulated price for each
export const extractSuperadminRulesAndPrices = async (
  carId: string,
  ids: null | string[],
  priceValue: number
) => {
  const superAdminMandatoryRules = await prisma.superadminRule.findMany({
    where: {
      OR: [
        {
          carId: carId,
        },
        {
          applyToAll: true,
        },
      ],
      mandatory: true,
    },
  });

  const refinedMandaturyRules = superAdminMandatoryRules.map((el) =>
    extractsuperadminRuleWithValueToPay(el, priceValue)
  );

  const optionalSuperAdminRules = ids
    ? await prisma.superadminRule.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      })
    : [];

  const refinedOptionalRules = optionalSuperAdminRules.map((el) =>
    extractsuperadminRuleWithValueToPay(el, priceValue)
  );

  const mandatoryRulesPrice = !!refinedMandaturyRules.length
    ? refinedMandaturyRules.reduce((acc, el) => acc + el.valueToPay, 0)
    : 0;
  const optionalRulesPrice = !!refinedOptionalRules.length
    ? refinedOptionalRules.reduce((acc, el) => acc + el.valueToPay, 0)
    : 0;

  return {
    refinedMandaturyRules,
    refinedOptionalRules,
    mandatoryRulesPrice,
    optionalRulesPrice,
  };
};

//generate booking code function
export function generateCode() {
  const numbers = Math.floor(Math.random() * 90000000) + 10000000; // Ensure 8 digits
  const code = "A" + numbers;
  return code;
}

//check the boooking code uniqness
export const generateBookingCode = async () => {
  let bookingCode = generateCode();
  let existingBooking = await prisma.booking.findFirst({
    where: {
      bookingCode: bookingCode,
    },
    select: { bookingCode: true },
  });

  while (existingBooking) {
    bookingCode = generateCode();
    existingBooking = await prisma.booking.findFirst({
      where: {
        bookingCode: bookingCode,
      },
      select: { bookingCode: true },
    });
  }

  return bookingCode;
};

export const currentMonthRange = ()=>{
  const now = new Date();
const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
return {firstDayOfCurrentMonth,firstDayOfNextMonth}
}


export const previousMonthRange = ()=>{

  const { firstDayOfCurrentMonth, firstDayOfNextMonth } = currentMonthRange();

const firstDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
firstDayOfPreviousMonth.setMonth(firstDayOfCurrentMonth.getMonth() - 1);
const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth)

return {firstDayOfPreviousMonth,lastDayOfPreviousMonth}
}


export const revenueMessage = (revenuePreviousMonth: number, revenueCurrentMonth: number):{color:string,message:string,status:"increase" | "noChange" | "decrease"} => {

  let color;
  let status :"increase" | "noChange" | "decrease"

  if (revenuePreviousMonth === 0) {
    if (revenueCurrentMonth > 0) {
  
      return {
        message: "100% Increase (Previous month had no revenue)",
        status: 'increase',
        color: 'text-green-500', 
      };
    } else {
      // Both previous and current month's revenues are 0
      return {
        message: " (No revenue)",
        status: 'noChange',
        color: 'text-muted-foreground', 
      };
    }
  } else {
    // Calculate the percentage change when previous month's revenue is not zero
    const percentageChange = ((revenueCurrentMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100;
    status = percentageChange > 0 ? 'increase' : percentageChange < 0 ? 'decrease' : 'noChange';
    color = percentageChange > 0 ? 'text-green-500' : percentageChange < 0 ? 'text-rose-500' : 'text-muted-foreground'; // Choose color based on increase or decrease

    return {
      message: `Revenue Percentage Change: ${percentageChange.toFixed(2)}%`,
   status,
      color,
    };
  }
}



export const bookingChangeMessage = (totalBookingsPreviousMonth: number, totalBookingsThisMonth: number):{color:string,message:string,status:"increase" | "noChange" | "decrease"} => {
  let bookingChangeMessage;
  let status:"increase" | "noChange" | "decrease"
  let color; 

  if (totalBookingsPreviousMonth === 0) {
    if (totalBookingsThisMonth > 0) {
      // Previous month had no bookings, and this month has bookings
      bookingChangeMessage = "100%  Increase (Previous month had no bookings)";
      status = 'increase';
      color = 'text-green-500';
    } else {
      // No bookings in both the previous and current month
      bookingChangeMessage = "(No bookings)";
      status = 'noChange';
      color = 'text-muted-foreground';
    }
  } else {
    const percentageChange = ((totalBookingsThisMonth - totalBookingsPreviousMonth) / totalBookingsPreviousMonth) * 100;
    status = percentageChange > 0 ? 'increase' : percentageChange < 0 ? 'decrease' : 'noChange';
    color = percentageChange > 0 ? 'text-green-500' : percentageChange < 0 ? 'text-rose-500' : 'text-muted-foreground';
    bookingChangeMessage = `Booking Percentage Change: ${percentageChange.toFixed(2)}% (${status})`;
  }

  return {
    message: bookingChangeMessage,
    status,
    color,
  };
};




export const signToken = (payload:{email:string}) => {
  return jwt.sign(payload, process.env.TOKEN_KEY as string); // No expiration set
}


export const verifyToken = (token: string): {email:string} | null => {
  try {
    return jwt.verify(token, process.env.TOKEN_KEY as string) as {email:string}
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
