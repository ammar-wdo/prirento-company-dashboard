import CarFeed from "@/components/(car)/car-feed";
import Heading from "@/components/heading";
import NavigatorButton from "@/components/navigator-button";
import { Plus } from "lucide-react";

import React from "react";

type Props = {};

const page = async (props: Props) => {
  return (
    <div>
      <div className="flex md:items-center justify-between md:flex-row flex-col md:gap-0 gap-4">
        <Heading title="Cars" description="Manage your cars" />
      
      </div>
      <div className="mt-16">
        <CarFeed />
      </div>
    </div>
  );
};

export default page;
