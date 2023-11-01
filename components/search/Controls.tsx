import Filters from "$store/components/search/Filters.tsx";
import Sort from "$store/components/search/Sort.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Modal from "$store/components/ui/Modal.tsx";
import { useSignal } from "@preact/signals";
import type { ProductListingPage } from "apps/commerce/types.ts";

type Props =
  & Pick<
    ProductListingPage,
    "filters" | "breadcrumb" | "sortOptions"
  >
  & {
    displayFilter?: boolean;
  };

function SearchControls(
  { filters, displayFilter }: Props,
) {
  const open = useSignal(false);

  return (
    <>
      <Button
        class={`btn justify-between w-1/2 lg:w-48 btn-sm font-normal text-base-200 h-[34px] border-2 border-base-200 bg-white hover:bg-white ${
          displayFilter ? "" : "lg:hidden"
        }`}
        onClick={() => {
          open.value = true;
        }}
      >
        Filtrar
        <Icon
          id="Plus"
          size={20}
          strokeWidth={2}
          class="text-secondary-focus"
        />
      </Button>

      <Modal
        showHeader
        class="lg:w-[20%]"
        loading="lazy"
        title="Filtrar"
        mode="sidebar-left"
        open={open.value}
        onClose={() => {
          open.value = false;
        }}
      >
        <div class="p-8 py-2">
          <Filters filters={filters} />
        </div>
      </Modal>
    </>
  );
}

export default SearchControls;
