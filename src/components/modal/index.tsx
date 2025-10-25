import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

type ModalProps = {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  centerTitle?: boolean;
}

export const Modal = ({ children, title, open, onClose, className }: ModalProps) => {
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={true} className={cn("flex flex-col gap-6", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}