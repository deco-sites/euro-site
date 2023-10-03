import { useSignal } from "@preact/signals";
import { Runtime } from "$store/runtime.ts";
import type { Product } from "apps/commerce/types.ts";
import type { JSX } from "preact";
import Button from "$store/components/ui/Button.tsx";

interface Props {
  productID: Product["productID"];
}

const notifyme = Runtime.create("deco-sites/std/actions/vtex/notifyme.ts");

function Notify({ productID }: Props) {
  const loading = useSignal(false);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;

      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;
      const email =
        (e.currentTarget.elements.namedItem("email") as RadioNodeList)?.value;

      await notifyme({ skuId: productID, name, email });
    } finally {
      loading.value = false;
    }
  };

  return (
    <form
      class="flex flex-col py-10 px-12 gap-5 bg-neutral-200 rounded-[10px]"
      onSubmit={handleSubmit}
    >
      <div class="flex flex-col gap-1">
        <span class="text-xl text-emphasis uppercase">
          Produto indisponível
        </span>
        <span class="text-sm text-base-300">
          Para ser avisado da disponibilidade deste produto, basta preencher os
          campos abaixo:
        </span>
      </div>

      <div class="flex flex-col gap-[10px]">
        <input
          placeholder="Digite seu nome"
          class="input input-bordered border-2 focus:outline-none input-sm !py-4"
          name="name"
        />
        <input
          placeholder="Digite seu email"
          class="input input-bordered border-2 focus:outline-none input-sm !py-4"
          name="email"
        />
      </div>

      <Button
        type="submit"
        class="btn-secondary font-medium h-[2.25rem] disabled:loading"
        disabled={loading}
      >
        Avise-me
      </Button>
    </form>
  );
}

export default Notify;
