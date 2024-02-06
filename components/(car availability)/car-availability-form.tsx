"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, convertDateToISOString } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import ActionLoaderButton from "../action-loader-button";
import { useCarAvailability } from "@/hooks/car-availability";
import { CarAvailability } from "@prisma/client";
import ClientModalButton from "../client-modal-button";
import { deleteCarAvailability } from "@/actions/car-availability-actions";

type Props = {
  carAvailability: CarAvailability | null;
};

const CarAvailabilityForm = ({ carAvailability }: Props) => {
  const {
    form,
    onSubmit,
    times,
    startDateOpen,
    endDateOpen,
    setStartDateOpen,
    setEndDateOpen,
  } = useCarAvailability(carAvailability);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="label" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex  gap-3 items-start">
          <div className="grid flex-1 grid-cols-1 gap-3 w-fit">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Start Date</FormLabel>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger className="mt-0" asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        defaultMonth={
                          new Date(form.watch("startDate") || new Date())
                        }
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          field.onChange(convertDateToISOString(date));
                          setStartDateOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Start time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {times.map((time, i) => (
                        <SelectItem
                          className="cursor-pointer text-center"
                          key={i}
                          value={time}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 w-fit flex-1">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>End date</FormLabel>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger className="mt-0" asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        defaultMonth={
                          new Date(form.watch("endDate") || new Date())
                        }
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          field.onChange(convertDateToISOString(date));
                          setEndDateOpen(false);
                        }}
                        disabled={(date) =>
                          date <
                            new Date(
                              new Date(form.watch("startDate")).setHours(
                                0,
                                0,
                                0,
                                0
                              )
                            ) ||
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>End time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {times.map((time, i) => (
                        <SelectItem
                          className="cursor-pointer text-center"
                          key={i}
                          value={time}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <ActionLoaderButton isLoading={form.formState.isSubmitting}>
            {carAvailability ? "Update" : "Submit"}
          </ActionLoaderButton>
          {carAvailability && (
            <ClientModalButton
            type="button"
            destructive
              modalInputs={{
                toDelete: true,
                deleteFunction: deleteCarAvailability,
                deleteId: carAvailability.id,
                modal: "delete",
                url:`/dashboard/cars/${carAvailability.carId}/availability`
              }}
            >
              Delete
            </ClientModalButton>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CarAvailabilityForm;
