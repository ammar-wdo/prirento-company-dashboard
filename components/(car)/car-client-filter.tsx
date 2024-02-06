"use client";
import { Car, CarModel } from "@prisma/client";
import React, { useState } from "react";
import CarCard from "./car-card";
import { Input } from "../ui/input";
import NoResult from "../no-result";
import NavigatorButton from "../navigator-button";
import { Plus, Search } from "lucide-react";

type Props = {
  cars: (Car & {
    carModel: CarModel & {
      carBrand: { brand: string };
    };
  })[];
};

const CarClientFilter = ({ cars }: Props) => {
    const [filterCarName, setFilterCarName] = useState('')


  const refinedCars = cars.map((car) => ({
    name: `${car.carModel.carBrand.brand} ${car.carModel.name}`,
    ...car,
  }));

  const filterdCars = refinedCars.filter((car)=>{
   if(!filterCarName) return true
   else return car.name.toLocaleLowerCase().includes(filterCarName.toLocaleLowerCase())
  })


  {!cars.length && <NoResult title="No cars" />}

  return (
    <div className="">
        <div className="flex flex-col gap-2 w-full md:flex-row md:justify-between md:items-center">
        <NavigatorButton href="/dashboard/cars/new" variant={"site"}>
          <Plus  className="mr-2 w-4 h-4"/>Create New Car
        </NavigatorButton>
        <div className="md:w-[300px] w-full relative border rounded-md p-1 bg-white  pl-5">
            <Search className="absolute left-2 top-1/2 -translate-y-[50%] w-5 h-5"/>
            <Input className="border-0 bg-transparent  focus-visible:ring-0 focus-visible:ring-transparent" value={filterCarName} onChange={(e)=>setFilterCarName(e.target.value)} placeholder="Search by brand or model "/>
        </div>
       
        </div>
       
        {!filterdCars.length && <NoResult className="mt-12" title="No cars found"/>}
  <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-12">
      {filterdCars.map((car) => (
        <div className="w-full" key={car?.id}>
          <CarCard  car={car} />
        </div>
      ))}
    </div>
    </div>
  
  );
};

export default CarClientFilter;
