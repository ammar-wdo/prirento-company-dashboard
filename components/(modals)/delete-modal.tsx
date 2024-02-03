"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/modal.hook";
type Props = {};

const DeleteModal = (props: Props) => {

  
  const [isLoading, setIsLoading] = useState(false);

  const { open, modalInputs, setClose} = useModal();
  const router = useRouter()

  if(modalInputs?.toDelete!== true) return 

  const {deleteFunction,deleteId} = modalInputs

  const isOpen = open && modalInputs?.toDelete === true;

  const handleDelete = async () => {
    if (!deleteFunction || !deleteId) return;
    try {
      setIsLoading(true);
      const res = await deleteFunction(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        modalInputs.url && router.push(modalInputs.url)
        router.refresh()
        setClose()
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button onClick={setClose} variant={"ghost"}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleDelete}
            variant={"destructive"}
          >
            Delete{" "}
            {isLoading && <Loader className="ml-3 h-3 w-3 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
