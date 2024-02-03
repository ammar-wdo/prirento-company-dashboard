import { cn } from "@/lib/utils";
import { Car, CarBrand, CarModel } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { statusMap } from "../mapping";
import NavigatorButton from "../navigator-button";
import ToolTip from "../tool-tip";
import { CheckCircle, Edit, HandCoins, Settings } from "lucide-react";
import SwiperComponent from "../swiper-component";

type Props = {
  car: Car & { carModel: CarModel & { carBrand: { brand: string } } };
};

const CarCard = ({ car }: Props) => {
  return (
    <div className=" rounded-xl overflow-hidden border flex flex-col w-[300px] md:w-[400px] shrink-0">
      <SwiperComponent gallary={car.gallary}/>
      <div className="p-4 bg-white flex flex-col gap-2 flex-1">
        <h3 className="capitalize text-lg font-medium">
          {car.carModel.carBrand.brand} {car.carModel.name}
        </h3>
        <p>{car.year}</p>
        <p
          className={cn(
            "capitalize p-1 w-fit text-xs mb-16",
            statusMap[car.carStatus]
          )}
        >
          {car.carStatus}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-3 ">
          <ToolTip
            border="border-black"
            text="text-white"
            backGround="bg-slate-900"
            side="top"
            title="Edit"
            description="edit your car"
          >
            <NavigatorButton
              variant={"siteSecondary"}
              className="w-full"
              href={`/dashboard/cars/${car.id}`}
            >
              <Edit />
            </NavigatorButton>
          </ToolTip>
          <ToolTip
            border="border-black"
            text="text-white"
            backGround="bg-slate-900"
            side="top"
            title="Pricings"
            description="Manage pricings for each day"
          >
            <NavigatorButton
              variant={"siteSecondary"}
              className="w-full"
              href={`/dashboard/cars/${car.id}/pricing`}
            >
              <HandCoins />
            </NavigatorButton>
          </ToolTip>
          <ToolTip
            border="border-black"
            text="text-white"
            backGround="bg-slate-900"
            side="bottom"
            title="Availability"
            description="Control your car availability for renting"
          >
            <NavigatorButton
              variant={"siteSecondary"}
              className="w-full"
              href={`/dashboard/cars/${car.id}/availability`}
            >
              <CheckCircle />
            </NavigatorButton>
          </ToolTip>
          <ToolTip
            border="border-black"
            text="text-white"
            backGround="bg-slate-900"
            side="bottom"
            title="Extra options"
            description="Add extra options to your car"
          >
            <NavigatorButton
              variant={"siteSecondary"}
              className="w-full"
              href={`/dashboard/cars/${car.id}/extra-options`}
            >
              <Settings />
            </NavigatorButton>
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
