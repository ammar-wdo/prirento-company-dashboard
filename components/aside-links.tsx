"use client";

import { cn } from "@/lib/utils";
import {
  Archive,
  Building2,
  Car,
  CarIcon,
  Coins,
  Component,
  Gavel,
  Grid3X3,
  LayoutDashboard,
  Navigation,
  Settings,
  ShipWheel,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import SignoutButton from "./signout-button";

export type CompanyType = "cars" | "yacths";
type Props = {
  companyType: CompanyType;
};

const AsideLinks = ({ companyType }: Props) => {
  const pathname = usePathname();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: <LayoutDashboard className="h-6 w-6 text-secondaryGold" />,
    },
    {
      label: "Cars",
      href: "/dashboard/cars",
      active: pathname === "/dashboard/cars",
      icon: <CarIcon className="h-6 w-6 text-secondaryGold" />,
      type: "cars",
    },
    {
      label: "Yachts",
      href: "/dashboard/yachts",
      active: pathname === "/dashboard/yachts",
      icon: <Navigation className="h-6 w-6 text-secondaryGold" />,
      type: "yacths",
    },
    {
      label: "Bookings",
      href: "/dashboard/bookings",
      active: pathname === "/dashboard/bookings",
      icon: <Archive className="h-6 w-6 text-secondaryGold" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
      icon: <Settings className="h-6 w-6 text-secondaryGold" />,
    },
  ];

  const router = useRouter();
  return (
    <div className=" flex flex-col w-full flex-1 gap-y-3">
      {links.map(({ label, href, active, icon, type }) => {
        if(type && companyType!==type) return
        return  <button
        onClick={() => router.push(href)}
        className={cn(
          "flex items-center gap-3 p-2 text-lg font-medium hover:bg-white/10 rounded-xl text-white transition cursor-pointer w-full",
          active && "bg-white text-main hover:bg-white"
        )}
        key={label}
      >
        {icon}
        <span className="text-sm font-medium "> {label}</span>
       
      </button>
      })}
      <div className="mt-auto w-full">
        <SignoutButton />
      </div>
    </div>
  );
};

export default AsideLinks;
