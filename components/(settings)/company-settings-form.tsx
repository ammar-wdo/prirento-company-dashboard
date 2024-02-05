"use client";


import { Category, Company } from "@prisma/client";

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



import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SingleImageDropzone } from "../single-image-dropezone";

import ActionLoaderButton from "../action-loader-button";
import { useCompany } from "@/hooks/company-settings.hook";



type Props = {  company: Company };

const CompanySettingsForm = ({  company }: Props) => {
  const {
    form,
    onSubmit,
    file,
    setFile,
    uploadImage,
    ImagePlaceholder,
    imagesFile,
    setImagesFile,
    ImagesPlaceholder,
    uploadImages,
    logOut
  } = useCompany({ company });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
      

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail*</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />


   <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password*</FormLabel>
              <FormControl>
                <Input type="password" placeholder="new password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

       

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address*</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number*</FormLabel>
              <FormControl>
                <PhoneInput
                  enableSearch={true}
                  buttonStyle={{ border: "none" }}
                  containerStyle={{
                    borderRadius: "7px",
                    paddingBlock: 3,
                    width: "100%",
                    border: "0.4px #ECECEC solid",
                  }}
                  inputStyle={{
                    border: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                  value={form.getValues("phoneNumber")}
                  onChange={(phone) => form.setValue("phoneNumber", phone)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsApp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp number*</FormLabel>
              <FormControl>
                <PhoneInput
                  enableSearch={true}
                  buttonStyle={{ border: "none" }}
                  containerStyle={{
                    borderRadius: "7px",
                    paddingBlock: 3,
                    width: "100%",
                    border: "0.4px #ECECEC solid",
                  }}
                  inputStyle={{
                    border: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                  value={form.getValues("whatsApp")}
                  onChange={(phone) => form.setValue("whatsApp", phone)}
                />
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

        <FormField
          control={form.control}
          name="gallary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add images</FormLabel>
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

      




      

       {logOut&& <div className="p-6 font-medium border-yellow-500 bg-yellow-500/20 text-muted-foreground w-full border text-sm">
       You will be signed out after 7 seconds to log in again with new credentials
        </div>}

        <ActionLoaderButton   isLoading={form.formState.isSubmitting}>Update</ActionLoaderButton>
       
 
      </form>
    </Form>
  );
};

export default CompanySettingsForm;
