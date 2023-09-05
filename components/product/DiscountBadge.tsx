type Props = {
  price: number;
  listPrice: number;
  label?: string;
  variant?: string;
  className?: string;
};

function DiscountBadge({ price, listPrice, label, variant, className }: Props) {
  const discount = ((listPrice - price) / listPrice) * 100;

  return (
    <div
      class={`absolute left-0 top-0 p-[10px] flex items-center z-10 ${className}`}
    >
      <div
        class={`text-xs uppercase font-bold border-none px-[10px] py-[7px] rounded-lg flex box-content bg-opacity-100 opacity-100 text-base-100 bg-${
          variant ?? "emphasis"
        }`}
      >
        {discount?.toFixed(2).slice(0, 2)}% {label ?? "OFF"}
      </div>
    </div>
  );
}

export default DiscountBadge;
