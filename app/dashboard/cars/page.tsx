import CarFeed from "@/components/(car)/car-feed";
import Heading from "@/components/heading";
import NavigatorButton from "@/components/navigator-button";
import { Plus } from "lucide-react";

import React from "react";

type Props = {};

const page = async (props: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Cars" description="Manage your cars" />
        <NavigatorButton href="/dashboard/cars/new" variant={"site"}>
          <Plus /> Create New Car
        </NavigatorButton>
      </div>
      <div className="mt-16">
        <CarFeed />
      </div>
    </div>
  );
};

export default page;