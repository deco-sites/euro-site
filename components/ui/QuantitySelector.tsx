import Icon from "$store/components/ui/Icon.tsx";
import Button from "../ui/Button.tsx";

interface Props {
  quantity: number;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (quantity: number) => void;
}

const QUANTITY_MAX_VALUE = 100;

// Remove default browser behavior: https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
// TODO: Figure out how to add it via tailwind config.
const innerStyle = `
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
`;

function QuantitySelector({ onChange, quantity, disabled, loading }: Props) {
  const decrement = () => onChange?.(Math.max(0, quantity - 1));

  const increment = () =>
    onChange?.(Math.min(quantity + 1, QUANTITY_MAX_VALUE));

  return (
    <div class="form-control">
      <div class="input-group items-center">
        <Button
          class="bg-transparent border-0 p-0 border-none"
          onClick={decrement}
          disabled={disabled}
          loading={loading}
        >
          <Icon
            class="btn-primary text-secondary-focus hover:text-neutral-100 transition-all w-6 h-6 rounded-full"
            id="Minus"
            width={16}
            height={16}
          />
        </Button>
        <input
          class="text-center rounded-lg border-base-200 w-10 h-10 border-2 mx-2.5 text-sm font-bold text-base-content"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          max={QUANTITY_MAX_VALUE}
          min={1}
          value={quantity}
          disabled={disabled}
          onBlur={(e) => onChange?.(e.currentTarget.valueAsNumber)}
        />
        <Button
          class="bg-transparent border-0 p-0 border-none"
          onClick={increment}
          disabled={disabled}
          loading={loading}
        >
          <Icon
            class="btn-primary text-secondary-focus hover:text-neutral-100 transition-all w-6 h-6 rounded-full"
            id="Plus"
            width={16}
            height={16}
          />
        </Button>
      </div>
    </div>
  );
}

export default QuantitySelector;
