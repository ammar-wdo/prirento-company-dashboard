import { CarTypes, Transmission } from "@prisma/client";


export type CarCardType = {
    id: string;
    carName: string;
    year: string;
    seats: number;
    kmIncluded: number;
    carType: CarTypes;
    gallary: string[];
    transmition: Transmission;
    oneDayPrice: number;
    companyLogo: string;
  };
  
  export type CarPublicType = Omit<CarCardType, 'oneDayPrice'> & {
    availablePrice: number | null;
    notAvailable: boolean;
    period:string
  };