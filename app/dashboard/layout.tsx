import MobileSheet from "@/components/mobile-sheet";

import SideBar from "@/components/side-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="relative">
      <MobileSheet>
      
          <SideBar sheet={true} />
    
      </MobileSheet>
      <SideBar />
      <main className="lg:pl-80 md:p-20 p-8 bg-muted min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default layout;
