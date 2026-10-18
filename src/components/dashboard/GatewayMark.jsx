import { PaymentMark } from "@/components/dashboard/PaymentMark";
import { BuildingIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * A way to pay in, as a round mark: its brand's (see PaymentMark), or a bank
 * for a bank transfer. Size it with `className`. Decorative: name it beside.
 */
export function GatewayMark({ id, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-line",
        id === "bank" && "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
        className,
      )}
    >
      {id === "bank" ? <BuildingIcon className="size-[45%]" /> : <PaymentMark id={id} className="absolute inset-0" />}
    </span>
  );
}
