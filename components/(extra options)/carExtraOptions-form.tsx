"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import { Input } from "@/components/ui/input";

import ActionLoaderButton from "../action-loader-button";

import { useCarExtraOptions } from "@/hooks/car-extra-options.hook";
import { Textarea } from "../ui/textarea";

import { SingleImageDropzone } from "../single-image-dropezone";
import { CarExtraOption } from "@prisma/client";
type Props = {extraOption:CarExtraOption | null};

const CarExtraOptionsForm = ({extraOption}: Props) => {
  const { form, onSubmit,file,setFile,uploadImage,ImagePlaceholder } = useCarExtraOptions(extraOption);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label*</FormLabel>
              <FormControl>
                <Input placeholder="label" {...field} />
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
                <Textarea placeholder="description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price*</FormLabel>
              <FormControl>
                <Input placeholder="price" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      

<FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo*</FormLabel>
              <div className="flex items-center gap-3 w-full flex-wrap">
                <FormControl>
                  <SingleImageDropzone
                    width={200}
                    height={200}
                    value={file}
                    onChange={(file) => {
                      setFile(file);
                    }}
                  />
                </FormControl>
                <Button
                  disabled={!file || !!form.watch("logo")}
                  type="button"
                  onClick={uploadImage}
                >
                  Upload
                </Button>
              </div>
              <ImagePlaceholder />

              <FormMessage />
            </FormItem>
          )}
        />

        <ActionLoaderButton className="w-full" isLoading={form.formState.isSubmitting}>
          {extraOption
            ? "Update"
            : "Submit"}
        </ActionLoaderButton>
      </form>
    </Form>
  );
};

export default CarExtraOptionsForm;
