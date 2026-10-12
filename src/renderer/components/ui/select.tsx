import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  caretIcon?: boolean;
}

const SelectTrigger = ({ className, children, caretIcon = true, ...props }: SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={cn(
      'inline-flex h-9 items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 shadow-sm outline-none transition-colors hover:border-slate-600 focus:ring-2 focus:ring-blue-500/40 data-[placeholder]:text-slate-500',
      className,
    )}
    {...props}
  >
    {children}
    {caretIcon && (
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 ease-out data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    )}
  </SelectPrimitive.Trigger>
);

const SelectContent = ({
  className,
  children,
  position = 'popper',
  sideOffset = 6,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SelectPrimitive.SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      position={position}
      sideOffset={sideOffset}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'z-[85] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl bg-slate-900/95 p-1 text-slate-200 shadow-2xl backdrop-blur-md outline-none transition-all duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ className, children, ...props }: SelectPrimitive.SelectItemProps) => (
  <SelectPrimitive.Item
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
