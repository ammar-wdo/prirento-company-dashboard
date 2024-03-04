"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";


type Props = {
    bookings:{id:string,startDate:Date,endDate:Date}[],
    availabilities:{id:string,startDate:Date,endDate:Date}[]
}

const FullCalendarComponent = ({bookings,availabilities}:Props) => 
{ 



    const refinedBookings = bookings.map(booking=>({start:booking.startDate,end:booking.endDate,backgroundColor: '#0C460E',
    borderColor:'#0C460E'}))

    const refinedAvailabilites = availabilities.map(availability=>({start:availability.startDate,end:availability.endDate,backgroundColor: '#f43f5e',
    borderColor:'#f43f5e'}))


    return <div className="min-h-[700p] min-w-[1200px]">
        <div className="my-10">
            <div className="flex items-center gap-3 font-medium capitalize">booking ranges <span className="bg-secondaryGreen w-4 h-4 rounded-sm"></span></div>
            <div className="flex items-center gap-3 font-medium capitalize">Blocking ranges <span className="bg-rose-500 w-4 h-4 rounded-sm"></span></div>
            <div></div>

        </div>
    <FullCalendar
    timeZone="UTC"
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={[...refinedBookings,...refinedAvailabilites]}
      eventTimeFormat={{
        // Define the format for the time and date
        hour: "2-digit",
        minute: "2-digit",
        meridiem: true,
        hour12: true, // Use 12-hour clock, set to false for 24-hour
        month: "short", // "Jan", "Feb", etc.
        day: "numeric", // Day of the month
      }}
      allDaySlot={false}
      displayEventEnd={true}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      slotDuration='01:00:00'
    
    />
  </div>}
;

export default FullCalendarComponent;
