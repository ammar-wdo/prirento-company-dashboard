'use client'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { ScrollArea } from "./ui/scroll-area";
import { ChevronDown } from "lucide-react";

type Props = {time:string;
    generateTimeSlots: (stepMinutes?: number) => string[];

    open:boolean;
    toggle:()=>void;
    onChange:(value:string)=>void
}

const TimeSelect = ({time,generateTimeSlots,open,toggle,onChange}: Props) => {
  return (
    <Popover open={open} onOpenChange={toggle}>
    <PopoverTrigger className="hover:bg-muted transition min-w-[55px] flex items-center gap-1 w-fit p-1 px-1 md:px-2 rounded-md border md:text-sm text-xs">{time || 'Select time'} <ChevronDown className="md:w-4 md:h-4 w-3 h-3"/></PopoverTrigger>
    <PopoverContent className="w-fit">
    <ScrollArea className="h-[250px]  w-fit p-3">
      
      {generateTimeSlots().map((timeToChoose,i)=><button onClick={(()=>{toggle();onChange(timeToChoose)})} className="block p-2 rounded-md hover:bg-muted transition text-sm" key={i}>{timeToChoose}</button>)}

     
    </ScrollArea>
    </PopoverContent>
  </Popover>
  )
}

export default TimeSelect