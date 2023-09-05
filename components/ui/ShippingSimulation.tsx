import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import type {
  SimulationOrderForm,
  SKU,
  Sla,
} from "deco-sites/std/packs/vtex/types.ts";

export interface Props {
  items: Array<SKU>;
  shipmentPolitics?: {
    label: string;
    link: string;
  };
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

function ShippingContent({ simulation }: {
  simulation: Signal<SimulationOrderForm | null>;
}) {
  const { cart } = useCart();

  const methods = simulation.value?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  const locale = cart.value?.clientPreferencesData.locale || "pt-BR";
  const currencyCode = cart.value?.storePreferencesData.currencyCode || "BRL";

  if (simulation.value == null) {
    return null;
  }

  if (methods.length === 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col text-xs rounded-[10px]">
      {methods.map((method) => (
        <li class="flex text-secondary-focus px-[20px] py-[10px] odd:bg-secondary-focus odd:bg-opacity-5 justify-between items-center first:rounded-t-[10px] last:rounded-b-[10px]">
          <span class="text-center text-secondary font-bold">
            {method.name}
          </span>
          <span class="text-button">
            Em até {formatShippingEstimate(method.shippingEstimate)}
          </span>
          <span class="text-base font-bold text-right">
            {method.price === 0 ? "Grátis" : (
              formatPrice(method.price / 100, currencyCode, locale)
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ShippingSimulation({ items, shipmentPolitics }: Props) {
  const postalCode = useSignal("");
  const loading = useSignal(false);
  const simulateResult = useSignal<SimulationOrderForm | null>(null);
  const { simulate, cart } = useCart();

  const handleSimulation = useCallback(async () => {
    if (postalCode.value.length !== 8) {
      return;
    }

    try {
      loading.value = true;
      simulateResult.value = await simulate({
        items: items,
        postalCode: postalCode.value,
        country: cart.value?.storePreferencesData.countryCode || "BRA",
      });
    } finally {
      loading.value = false;
    }
  }, []);

  return (
    <div class="flex flex-col mt-[10px] gap-5 p-[30px] rounded-[10px] bg-neutral-200 text-base-300">
      <p class="text-justify">
        Calcule o frete e o prazo de entrega estimados para sua região. Informe
        seu CEP:
      </p>
      <div class="flex flex-col gap-[10px]">
        <form
          class="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulation();
          }}
        >
          <input
            as="input"
            type="text"
            class="input input-bordered input-sm text-xs border-2 focus:outline-none w-full max-w-xs !py-4"
            placeholder="Seu cep aqui"
            value={postalCode.value}
            maxLength={8}
            onChange={(e: { currentTarget: { value: string } }) => {
              postalCode.value = e.currentTarget.value;
            }}
          />
          <Button
            type="submit"
            loading={loading.value}
            class="btn-secondary h-[2.25rem] px-5"
          >
            Calcular
          </Button>
        </form>
      </div>
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        class="uppercase text-emphasis text-xs"
      >
        Não sei meu CEP
      </a>
      {simulateResult.value
        ? <ShippingContent simulation={simulateResult} />
        : null}
      {shipmentPolitics && (
        <a href={shipmentPolitics.link} class="uppercase text-emphasis text-xs">
          {shipmentPolitics.label}
        </a>
      )}
    </div>
  );
}

export default ShippingSimulation;
