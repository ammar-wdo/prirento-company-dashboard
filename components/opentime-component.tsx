'use client'

import { cn, generateTimeSlots } from "@/lib/utils";
import TimeSelect from "./time-select";

import { Checkbox } from "./ui/checkbox";
import { Day, DropdownStatus } from "@/hooks/company-settings.hook";

type Props = {
    day:Day,
    toggleDropdown:(day:Day,type:'openTimeDropdown' | 'closeTimeDropdown')=>void;
    dropdownStatus:DropdownStatus;
    setter:(day:Day,type:'openTime' | 'closeTime',value:string)=>void;
    toggleClose:(day:Day)=>void;
    openTime:string;
    closeTime:string;
    isClosed:boolean;
    isChecked:boolean
}

const OpentimeComponent = ({day,toggleDropdown,dropdownStatus,setter,toggleClose,openTime,closeTime,isClosed,isChecked}: Props) => {
  return (
    <li className={cn("grid grid-cols-4 gap-4",isClosed && 'opacity-30')} key={day}>
    <span className="text-xs md:text-base shrink">
      {day}
    </span>{" "}
    <TimeSelect
      open={dropdownStatus[day].openTimeDropdown}
      toggle={() => {
        toggleDropdown(day, "openTimeDropdown");
      }}
      onChange={(value: string) =>
        setter(day as Day, "openTime", value)
      }
      generateTimeSlots={generateTimeSlots}
      time={openTime}
    />{" "}
    <TimeSelect
      generateTimeSlots={generateTimeSlots}
      time={closeTime}
      open={dropdownStatus[day].closeTimeDropdown}
      toggle={() =>
        toggleDropdown(day, "closeTimeDropdown")
      }
      onChange={(value: string) =>
        setter(day as Day, "closeTime", value)
      }
    />
    <Checkbox
    className="justify-self-center"
      checked={isChecked}
      onCheckedChange={()=>toggleClose(day as Day)}
    />
  </li>
  )
}

export default OpentimeComponent