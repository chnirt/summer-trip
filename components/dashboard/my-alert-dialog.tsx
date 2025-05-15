import { MouseEventHandler } from "react";
import { LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function MyAlertDialog({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
}: {
  title: string;
  description: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: MouseEventHandler<HTMLButtonElement> | undefined;
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}) {
  return (
    <AlertDialog {...{ open, onOpenChange }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onCancel} variant="outline">
            {cancelText}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {submitText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
