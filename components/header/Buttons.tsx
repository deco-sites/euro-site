import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { formatPostalCode } from "../../utils/address.ts";

function SearchButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      class="btn-square btn-ghost flex items-center justify-center"
      aria-label="search icon button"
      onClick={() => {
        displaySearchbar.value = !displaySearchbar.peek();
      }}
    >
      <Icon
        class="text-base-content"
        id="MagnifyingGlass"
        width={20}
        height={20}
        strokeWidth={0.1}
      />
    </Button>
  );
}

function MenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="rounded-full border-2 border-solid no-animation btn-ghost relative flex justify-center items-center lg:hidden"
      aria-label="open menu"
      onClick={() => {
        displayMenu.value = true;
      }}
    >
      <Icon class="text-base-content" id="Menu" width={25} height={25} />
    </Button>
  );
}

function CartButton() {
  const { displayCart } = useUI();
  const { loading, cart, mapItemsToAnalyticsItems } = useCart();
  const totalItems = cart.value?.items.length || null;
  const currencyCode = cart.value?.storePreferencesData.currencyCode;
  const total = cart.value?.totalizers.find((item) => item.id === "Items");
  const discounts = cart.value?.totalizers.find((item) =>
    item.id === "Discounts"
  );

  const onClick = () => {
    displayCart.value = true;
    sendEvent({
      name: "view_cart",
      params: {
        currency: cart.value ? currencyCode! : "",
        value: total?.value
          ? (total?.value - (discounts?.value ?? 0)) / 100
          : 0,

        items: cart.value ? mapItemsToAnalyticsItems(cart.value) : [],
      },
    });
  };

  return (
    <Button
      class="btn-square btn-ghost relative flex justify-center items-center"
      aria-label="open cart"
      data-deco={displayCart.value && "open-cart"}
      loading={loading.value}
      onClick={onClick}
    >
      <div class="indicator">
        {totalItems && (
          <span class="indicator-item text-base-100 bg-emphasis w-4 h-4 rounded-full text-xs left-4 top-3 font-bold">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
        <Icon
          class="text-base-content"
          id="ShoppingCart"
          width={24}
          height={24}
          strokeWidth={1}
        />
      </div>
    </Button>
  );
}

function ModalPostalCodeButton() {
  const { displayModalPostalCode } = useUI();

	const cartModule = useCart();
  const { cart, loading } = cartModule;

	const postalCode = cart?.value?.shippingData?.address?.postalCode

  function handleModalPostalCode() {
    displayModalPostalCode.value = true
  }

  const formattedPostalCode = formatPostalCode(postalCode) 
  return !loading.value ? (
    <button class="text-[#e7527c] flex gap-2 items-center" onClick={handleModalPostalCode}>
      <Icon
        class="text-base-content"
        id="MapPin"
        width={24}
        height={24}
        strokeWidth={1}
      />
      <p className="hidden lg:inline after:absolute after:transition-all after:duration-100 after:-bottom-1 relative after:left-0 after:w-full after:w-0 after:h-[1px] after:bg-emphasis transition-all duration-300 text-[#e7527c]">
        {postalCode ? `Mudar CEP: ${formattedPostalCode}` : "Informe seu CEP"}
        </p>
      </button>
  ) : null
}

function Buttons({ variant }: { variant: "cart" | "search" | "menu" | "postalCode" }) {
  if (variant === "cart") {
    return <CartButton />;
  }

  if (variant === "search") {
    return <SearchButton />;
  }

  if (variant === "menu") {
    return <MenuButton />;
  }

  if (variant === "postalCode") {
    return <ModalPostalCodeButton />;
  }

  return null;
}

export default Buttons;
