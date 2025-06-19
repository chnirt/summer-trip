import { SubmitHandler, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import MyFormField from "../my-form-field";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

type Field = {
  name: string;
  label: string;
};

export type Fields = Field[];

export default function CreateUpdateAlertDialog({
  title,
  description,
  open,
  onOpenChange,
  fields,
  onSubmit,
  submitText = "Submit",
  onCancel,
  cancelText = "Cancel",
  loading = false,
}: {
  title: string;
  description: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fields: Fields;
  onSubmit: SubmitHandler<unknown>;
  submitText?: string;
  onCancel?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  cancelText?: string;
  loading?: boolean;
}) {
  const form = useFormContext();
  const [uploading, setUploading] = useState(false);

  const isSubmitDisabled = loading || uploading;

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form?.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {fields.map((field, fi) => (
                <div key={[field.name, fi].join("-")}>
                  <MyFormField
                    {...{
                      control: form?.control,
                      className: "grid grid-cols-4 items-center gap-4",
                      ...field,
                      uploading,
                      setUploading,
                    }}
                  />
                </div>
              ))}
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div> */}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button type="submit" disabled={isSubmitDisabled}>
                {loading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
