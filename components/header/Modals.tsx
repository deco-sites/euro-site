import Loading from "$store/components/ui/Loading.tsx";
import Modal from "$store/components/ui/Modal.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { lazy, Suspense } from "preact/compat";

import type { Props as MenuProps } from "$store/components/header/Menu.tsx";
import { ICartProps } from "$store/components/minicart/Cart.tsx";
import PopUp from "$store/islands/PopUp.tsx"

const Menu = lazy(() => import("$store/components/header/Menu.tsx"));
const Cart = lazy(() => import("$store/components/minicart/Cart.tsx"));

interface Props {
  menu: MenuProps;
  minicart?: ICartProps;
}

function Modals({ menu, minicart }: Props) {
  const { displayCart, displayMenu, displayModalPostalCode } = useUI();

  const fallback = (
    <div class="flex justify-center items-center w-full h-full">
      <span class="loading loading-ring" />
    </div>
  );

  return (
    <>
      <Modal
        title="Entrar"
        menuIcon="User"
        mode="sidebar-left"
        loading="lazy"
        id="menu-modal"
        showHeader={false}
        open={displayMenu.value}
        onClose={() => {}}
        class="backdrop:bg-base-content backdrop:opacity-70 h-full"
        headerClass="mx-5 mt-4 mb-[10.5px] lg:mx-10"
      >
        <Suspense fallback={fallback}>
          <Menu {...menu} />
        </Suspense>
      </Modal>

      <Modal
        class="ml-auto h-full"
        headerClass="mx-5 mt-4 mb-[10.5px] lg:mx-10"
        title="Meu carrinho"
        mode="sidebar-right"
        showHeader
        id="minicart-modal"
        loading="lazy"
        open={displayCart.value}
        onClose={() => {
          displayCart.value = false;
        }}
      >
        <Suspense fallback={<Loading className="h-full"/>}>
          <Cart {...minicart as ICartProps} />
        </Suspense>
      </Modal>

      <Modal
        class="m-auto rounded-lg bg-white p-8"
        headerClass="mb-2"
        title="Escolha sua região"
        mode="center"
        showHeader
        id="postal-code-modal"
        loading="lazy"
        open={displayModalPostalCode.value}
        onClose={() => {
          displayModalPostalCode.value = false;
        }}
        >
        <PopUp />
      </Modal>
    </>
  );
}

export default Modals;
