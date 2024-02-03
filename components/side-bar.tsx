import React from "react";
import AsideLinks, { CompanyType } from "./aside-links";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

type Props = {};

const SideBar = async(props: Props) => {
  const session = await getServerSession(authOptions)
  const type = session?.user?.name as CompanyType
  return (
    <div className="w-72 border-r fixed top-0 left-0 min-h-screen flex flex-col bg-main py-8 px-4">
      <div className="mb-12">
        <div className="w-[100px] aspect-[14.73/7]  relative">
          <Image src={'/Logo.png'} fill alt="Logo"/>
        </div>
      </div>
      <AsideLinks companyType={type}/>
    </div>
  );
};

export default SideBar;
