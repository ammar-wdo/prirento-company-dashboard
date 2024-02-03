
import { useEdgeStore } from "@/lib/edgestore";
import { Loader, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {v4 as uuidv4 } from 'uuid';





  
  type Props = {
    form: any;
  };
export const useGallary= ({form}:Props)=>{


   
    const { edgestore } = useEdgeStore();

    const setImages = (url: string) => {
      const images = form.getValues("gallary");
      console.log('Image',images)
      form.setValue("gallary", [...images!, url]);
    };
  
    const [imagesFile, setImagesFile] = useState<File>();
    const [imagesLoader, setImagesLoader] = useState(false);
    const [deleteImagesLoader, setDeleteImagesLoader] = useState("");
    const uploadImages = async () => {
     
      if (imagesFile) {
        setImagesLoader(true);
        if (imagesFile) {
          const res = await edgestore.publicFiles.upload({
            file: imagesFile,
            onProgressChange: (progress) => {
              if (progress === 0) {
                setImagesLoader(true);
              } else {
                setImagesLoader(false);
              }
              ;
            },
          });
 
          setImages(res.url);
        
    
        
        }
      }
    };
  
    const deleteImages = (url: string) => {
      const images = form.getValues("gallary");
      form.setValue("gallary", [...images!.filter((image:string) => image !== url)]);
    };
  
  
    const deleteanImage = async (image: string) => {
      try {
        setDeleteImagesLoader(image);
        await edgestore.publicFiles.delete({
          url: image,
        });
  
       
      } catch (error) {
        console.log(error);
      } finally {
        setDeleteImagesLoader("");
        deleteImages(image);
      }
    };
  
    const ImagesPlaceholder = () => {
      return (
        <div className="flex items-center gap-3 w-full ">
        {(!!form.watch("gallary")?.length || imagesLoader) && (
          <div className="flex items-center gap-3 flex-wrap w-full">
            {form.watch("gallary")?.map((image:string) => (
              <div
                key={uuidv4()}
                className="w-[100px] h-[100px] overflow-hidden  relative"
               
              >
                {deleteImagesLoader === image ? (
                  <div className="flex items-center justify-center w-full h-full ">
                    <Loader className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <Image
                    alt="added logo"
                    src={image}
                    fill
                    className="object-contain rounded-lg"
                  />
                )}
  
                <XIcon
                  className="absolute top-0 right-0 cursor-pointer text-white bg-rose-400  w-4 h-4 p-0.5 rounded-md"
                  onClick={() => {
                    deleteanImage(image);
                  }}
                />
              
              </div>
            ))}
              {imagesLoader &&  <div
             
             className="w-[100px] h-[100px] overflow-hidden flex items-center justify-center  relative"
            
           >  <Loader className="w-5 h-5 animate-spin" /></div>}
          </div>
        )}
        
     </div> );
    };





    return {
        imagesFile,setImagesFile,uploadImages,ImagesPlaceholder,deleteImagesLoader,imagesLoader,deleteanImage
    }
}