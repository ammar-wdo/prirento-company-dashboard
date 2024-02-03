'use client'


import { useCar } from '@/hooks/car.hook';
import { Car, CarModel ,Location} from '@prisma/client';
import React from 'react'

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
import { Input } from "@/components/ui/input";
import ActionLoaderButton from "../action-loader-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  carColors,
  carColorsMapper,

  carTypes,
  electric,
  transmition,
} from "@/schemas";
import FormSectionsWrapper from '../form-sections-wrapper';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { SingleImageDropzone } from '../single-image-dropezone';
import { Checkbox } from '../ui/checkbox';
import ClientModalButton from '../client-modal-button';
import { deleteCar } from '@/actions/car-actions';

type Props = {
    car:
    | (Car & {
        pickupLocations: { id: string }[];
        dropoffLocations: { id: string }[];
     
      })
    | null;

  locations: Location[];
  models: (CarModel & { carBrand: { brand: string; logo: string } })[];
}





const CarForm = ({car,locations,models}: Props) => {

    const sortedModels = models
.sort((a, b) => {
  const brandA = a.carBrand.brand.toLowerCase();
  const brandB = b.carBrand.brand.toLowerCase();

  if (brandA < brandB) {
    return -1;
  }
  if (brandA > brandB) {
    return 1;
  }
  return 0;
})

    const {
        form,
        onSubmit,
        imagesFile,
        setImagesFile,
        uploadImages,
        ImagesPlaceholder,
      } = useCar(car);
  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
  

      <FormSectionsWrapper title="basic information">
        <FormField
          control={form.control}
          name="carModelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Model*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue
                      className=""
                      placeholder="Choose car model"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    sortedModels.map((model) => (
                      <SelectItem
                        key={model.id}
                        id={model.id}
                        value={model.id}
                        className=" cursor-pointer capitalize "
                      >
                        <div className="grid grid-cols-3 items-center  p-1 capitalize w-[450px]">
                          <span className="text-start">
                            {model.carBrand.brand}
                          </span>
                          <span className="text-start">{model.name}</span>
                          <span className="w-8 h-8 rounded-full relative ">
                            <Image
                              src={model.carBrand.logo}
                              alt="logo"
                              fill
                              className="object-contain"
                            />
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year*</FormLabel>
              <FormControl>
                <Input placeholder="Year, YYYY" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
    

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="description"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </FormSectionsWrapper>

      <FormSectionsWrapper title="apperance">
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car color*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Choose car color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {carColors.map((color) => (
                    <SelectItem
                      id={color}
                      key={color}
                      value={color}
                      className=" cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-[200px]">
                        <span>
                          {color}
                          {}
                        </span>
                        {color !== "Other" && (
                          <span
                            style={{
                              backgroundColor: `${
                                (
                                  carColorsMapper as {
                                    [key: string]: string;
                                  }
                                )[color]
                              }`,
                            }}
                            className="w-6 h-6 border rounded-full  "
                          />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interiorColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car interior color*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Choose car interior color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {carColors.map((color) => (
                    <SelectItem
                      id={color}
                      key={color}
                      value={color}
                      className=" cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-[200px]">
                        <span>
                          {color}
                          {}
                        </span>
                        {color !== "Other" && (
                          <span
                            style={{
                              backgroundColor: `${
                                (
                                  carColorsMapper as {
                                    [key: string]: string;
                                  }
                                )[color]
                              }`,
                            }}
                            className="w-6 h-6 border rounded-full  "
                          />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gallary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery*</FormLabel>
              <div className="flex items-center gap-3 w-full flex-wrap">
                <FormControl>
                  <SingleImageDropzone
                    width={200}
                    height={200}
                    value={imagesFile}
                    onChange={(imagesFile) => {
                      setImagesFile(imagesFile);
                    }}
                  />
                </FormControl>
                <Button
                  disabled={!imagesFile}
                  type="button"
                  onClick={uploadImages}
                >
                  Upload
                </Button>
              </div>
              <ImagesPlaceholder />

              <FormMessage />
            </FormItem>
          )}
        />
      </FormSectionsWrapper>

      <FormSectionsWrapper title="specifications">
        <FormField
          control={form.control}
          name="engine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engine*</FormLabel>
              <FormControl>
                <Input placeholder="car engine" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transmition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transmission*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Choose transmission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transmition.map((el) => (
                    <SelectItem
                      key={el}
                      id={el}
                      value={el}
                      className=" cursor-pointer capitalize"
                    >
                      {el}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="electric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Electric*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Choose electric satus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {electric.map((el) => (
                    <SelectItem
                      key={el}
                      id={el}
                      value={el}
                      className=" cursor-pointer capitalize"
                    >
                      {el}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car type*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Choose car type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {carTypes.map((type) => (
                    <SelectItem
                      id={type}
                      key={type}
                      value={type}
                      className=" cursor-pointer capitalize"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seats*</FormLabel>
              <FormControl>
                <Input placeholder="car seats" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doors*</FormLabel>
              <FormControl>
                <Input placeholder="car doors" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </FormSectionsWrapper>

      <FormSectionsWrapper title="rental details">
        <FormField
          control={form.control}
          name="kmIncluded"
          render={({ field }) => (
            <FormItem>
              <FormLabel>km Included*</FormLabel>
              <FormControl>
                <Input placeholder="km Included" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimumHours"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Minimum rental hours</FormLabel>
              <FormControl>
                <Input
                  placeholder="Minimum rental hours"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deposite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit*</FormLabel>
              <FormControl>
                <Input placeholder="Deposit" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coolDown"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Cool Down time (hours)*</FormLabel>
              <FormControl>
                <Input placeholder="Cool Down" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deleviryFee"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Delivery Fee*</FormLabel>
              <FormControl>
                <Input placeholder="Delivery Fee" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </FormSectionsWrapper>

      <FormField
        control={form.control}
        name="disabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none ">
              <FormLabel>Disable your car</FormLabel>
              <FormDescription>
                If checked, the car will not show on the website.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormSectionsWrapper title="locations">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:col-span-2">
          <FormField
            control={form.control}
            name="pickupLocations"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Pickup locations*
                  </FormLabel>
                </div>
                {locations.map((location) => (
                  <FormField
                    key={location.id}
                    control={form.control}
                    name="pickupLocations"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={location.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(location.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      location.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== location.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal capitalize">
                            {location.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dropoffLocations"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Dropoff locations*
                  </FormLabel>
                </div>
                {locations.map((location) => {
                  return (
                    <FormField
                      key={location.id}
                      control={form.control}
                      name="dropoffLocations"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={location.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(location.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        location.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== location.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal capitalize">
                              {location.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSectionsWrapper>
      {JSON.stringify(form.formState.errors)}

      <div className="w-full flex flex-col gap-1">
        <ActionLoaderButton
          className=" w-full"
          isLoading={form.formState.isSubmitting}
        >
          {car ? "Update" : "Submit"}
        </ActionLoaderButton>
        {car && (
          <ClientModalButton
            type="button"
            modalInputs={{
              toDelete: true,
              deleteFunction: deleteCar,
              deleteId: car.id,
              modal: "delete",
              url: "/dashboard/cars",
            }}
            destructive
          >
            Delete
          </ClientModalButton>
        )}
      </div>
    </form>
  </Form>
  )
}

export default CarForm