"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  Car,
  Coins,
  Component,
  Gavel,
  Grid3X3,
  LayoutDashboard,
  Navigation,
  ShipWheel,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import SignoutButton from "./signout-button";


type Props = {};

const AsideLinks = (props: Props) => {
  const pathname = usePathname();
  const links = [
    {
      label: "Main",
      elements: [
        {
          label: "Dashboard",
          href: "/dashboard",
          active: pathname === "/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          label: "Location",
          href: "/dashboard/location",
          active: pathname === "/dashboard/location",
          icon: <Navigation className="h-4 w-4" />,
        },
        {
          label: "Category",
          href: "/dashboard/category",
          active: pathname === "/dashboard/category",
          icon: <Grid3X3 className="h-4 w-4" />,
        },
        {
          label: "Company",
          href: "/dashboard/company",
          active: pathname === "/dashboard/company",
          icon: <Building2 className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Items",
      elements: [
        {
          label: "Car",
          href: "/dashboard/car",
          active: pathname === "/dashboard/car",
          icon: <Car className="h-4 w-4" />,
        },
        {
          label: "Yacht",
          href: "/dashboard/yacht",
          active: pathname === "/dashboard/yacht",
          icon: <ShipWheel className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Actions",
      elements: [
        {
          label: "Discount",
          href: "/dashboard/discount",
          active: pathname === "/dashboard/discount",
          icon: <Coins className="h-4 w-4" />,
        },
        {
          label: "Admin rules",
          href: "/dashboard/admin-rules",
          active: pathname === "/dashboard/admin-rules",
          icon: <Gavel className="h-4 w-4" />,
        },
      ],
    },
  ];

  const router = useRouter();
  return (
    <div className="p-4 flex flex-col w-full flex-1">
      {links.map((el) => (
        <div key={el.label}>
          <h3 className=" text-lg font-semibold mt-12">{el.label}</h3>
          <div className="flex flex-col gap-1">
            {el.elements.map((el) => (
              <button
                onClick={() => router.push(el.href)}
                className={cn(
                  "flex items-center gap-3 p-2 hover:bg-muted rounded-md transition cursor-pointer w-full",
                  el.active && "bg-muted"
                )}
                key={el.label}
              >
                {el.icon}
                <span className="text-sm font-medium "> {el.label}</span>
               
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-auto w-full">
      <SignoutButton/>
      </div>
      
    </div>
  );
};

export default AsideLinks;
