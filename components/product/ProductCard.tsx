import {
  BUTTON_VARIANTS,
  ButtonVariant,
} from "$store/components/minicart/Cart.tsx";
import Avatar from "$store/components/ui/Avatar.tsx";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import { sendEventOnClick } from "$store/sdk/analytics.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "deco-sites/std/commerce/types.ts";
import { mapProductToAnalyticsItem } from "deco-sites/std/commerce/utils/productToAnalyticsItem.ts";
import Image from "deco-sites/std/components/Image.tsx";
import DiscountBadge from "./DiscountBadge.tsx";

export interface Layout {
  basics?: {
    contentAlignment?: "Left" | "Center";
    oldPriceSize?: "Small" | "Normal";
    ctaText?: string;
    mobileCtaText?: string;
    ctaVariation?: ButtonVariant;
    ctaMode?: "Go to Product Page" | "Add to Cart";
  };
  discount: {
    label: string;
    variant:
      | "primary"
      | "secondary"
      | "neutral"
      | "accent"
      | "emphasis"
      | "success"
      | "info"
      | "error"
      | "warning";
  };
  elementsPositions?: {
    skuSelector?: "Top" | "Bottom";
    favoriteIcon?: "Top right" | "Top left";
  };
  hide: {
    productName?: boolean;
    productDescription?: boolean;
    allPrices?: boolean;
    installments?: boolean;
    skuSelector?: boolean;
    cta?: boolean;
  };
  onMouseOver?: {
    image?: "Change image" | "Zoom image";
    showFavoriteIcon?: boolean;
    showSkuSelector?: boolean;
    showCardShadow?: boolean;
    showCta?: boolean;
  };
}

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;
  layout?: Layout;
}

export const relative = (url: string) => {
  const link = new URL(url);
  return `${link.pathname}${link.search}`;
};

const WIDTH = 279;
const HEIGHT = 270;

function ProductCard({ product, preload, itemListName, layout }: Props) {
  const {
    url,
    productID,
    name,
    image: images,
    offers,
    isVariantOf,
  } = product;
  const productGroupID = isVariantOf?.productGroupID;
  const [front, back] = images ?? [];
  const { listPrice, price, installment, seller } = useOffer(offers);
  const possibilities = useVariantPossibilities(product);
  const variants = Object.entries(Object.values(possibilities)[0] ?? {});
  const clickEvent = {
    name: "select_item" as const,
    params: {
      item_list_name: itemListName,
      items: [
        mapProductToAnalyticsItem({
          product,
          price,
          listPrice,
        }),
      ],
    },
  };
  const l = layout;
  const align =
    !l?.basics?.contentAlignment || l?.basics?.contentAlignment == "Left"
      ? "left"
      : "center";
  const skuSelector = variants.map(([value, { urls }]) => (
    <li>
      <a href={urls[0]}>
        <Avatar
          variant={"default"}
          content={value}
          active={urls[0] === url}
        />
      </a>
    </li>
  ));

  const addToCartButtonClassNames = (variant: string | undefined) =>
    `lg:text-sm font-medium text-xs whitespace-nowrap m-auto btn max-md:min-h-[2.25rem] max-md:h-[2.25rem] btn-${
      BUTTON_VARIANTS[variant ?? "primary"]
    }`;

  const cta = layout?.basics?.ctaMode === "Go to Product Page"
    ? (
      <a
        href={url && relative(url)}
        aria-label="view product"
        class={`min-w-[162px] ${
          addToCartButtonClassNames(layout?.basics?.ctaVariation)
        }`}
      >
        <span class="max-lg:hidden flex font-medium">
          {l?.basics?.ctaText || "Ver produto"}
        </span>
        <span class="lg:hidden flex font-medium">
          {l?.basics?.mobileCtaText || "Add ao carrinho"}
        </span>
      </a>
    )
    : l?.basics?.mobileCtaText
    ? (
      <>
        <AddToCartButton
          quantity={1}
          name={product.name as string}
          discount={price && listPrice ? listPrice - price : 0}
          productGroupId={product.isVariantOf?.productGroupID ?? ""}
          price={price as number}
          sellerId={seller as string}
          skuId={product.sku}
          label={l?.basics?.ctaText}
          classes={`max-lg:hidden ${
            addToCartButtonClassNames(layout?.basics?.ctaVariation)
          }`}
        />
      </>
    )
    : (
      <AddToCartButton
        quantity={1}
        name={product.name as string}
        discount={price && listPrice ? listPrice - price : 0}
        productGroupId={product.isVariantOf?.productGroupID ?? ""}
        price={price as number}
        sellerId={seller as string}
        skuId={product.sku}
        label={l?.basics?.ctaText}
        classes={`${addToCartButtonClassNames(layout?.basics?.ctaVariation)}`}
      />
    );

  const price2: number = price as number;
  const listPrice2: number = listPrice as number;

  return (
    <div
      class={`card card-compact opacity-100 bg-opacity-100 group w-full ${
        align === "center" ? "text-center" : "text-start"
      } ${l?.onMouseOver?.showCardShadow ? "lg:hover:card-bordered" : ""}`}
      data-deco="view-product"
      id={`product-card-${productID}`}
      {...sendEventOnClick(clickEvent)}
    >
      <figure
        class="relative rounded-lg"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      >
        {/* Wishlist button */}
        <div
          class={`absolute top-2 z-10
          ${
            l?.elementsPositions?.favoriteIcon === "Top left"
              ? "left-2"
              : "right-2"
          }
          ${
            l?.onMouseOver?.showFavoriteIcon
              ? "lg:hidden lg:group-hover:block"
              : "lg:hidden"
          }
        `}
        >
          <WishlistIcon productGroupID={productGroupID} productID={productID} />
        </div>
        <a
          href={url && relative(url)}
          aria-label="view product"
          class="contents relative"
        >
          {listPrice2 !== price2 && (
            <DiscountBadge
              price={price2}
              listPrice={listPrice2}
              label={l?.discount?.label}
              variant={l?.discount?.variant}
            />
          )}
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            class={`
              absolute rounded-lg w-full
              ${
              (!l?.onMouseOver?.image ||
                  l?.onMouseOver?.image == "Change image")
                ? "duration-100 transition-opacity opacity-100 lg:group-hover:opacity-0"
                : ""
            }
              ${
              l?.onMouseOver?.image == "Zoom image"
                ? "duration-100 transition-scale scale-100 lg:group-hover:scale-105"
                : ""
            }
            `}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          {(!l?.onMouseOver?.image ||
            l?.onMouseOver?.image == "Change image") && (
            <Image
              src={back?.url ?? front.url!}
              alt={back?.alternateName ?? front.alternateName}
              width={WIDTH}
              height={HEIGHT}
              class="absolute transition-opacity rounded-lg w-full opacity-0 lg:group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, 20vw"
              loading="lazy"
              decoding="async"
            />
          )}
        </a>
      </figure>
      {/* Prices & Name */}
      <div class="flex-auto flex flex-col">
        {/* SKU Selector */}
        {(!l?.elementsPositions?.skuSelector ||
          l?.elementsPositions?.skuSelector === "Top") && (
          <>
            {l?.hide.skuSelector ? "" : (
              <ul
                class={`flex items-center gap-2 w-full ${
                  align === "center" ? "justify-center" : "justify-start"
                } ${l?.onMouseOver?.showSkuSelector ? "lg:hidden" : ""}`}
              >
                {skuSelector}
              </ul>
            )}
          </>
        )}

        {l?.hide.productName && l?.hide.productDescription
          ? ""
          : (
            <div class="flex flex-col gap-0 mt-[15px]">
              {l?.hide.productName
                ? ""
                : (
                  <h2 class="truncate text-xs font-bold text-base-content">
                    {isVariantOf?.name || name}
                  </h2>
                )}
              {l?.hide.productDescription
                ? ""
                : (
                  <p class="truncate text-sm lg:text-sm text-neutral">
                    {product.description}
                  </p>
                )}
            </div>
          )}
        {l?.hide.allPrices ? "" : (
          <div class="flex flex-col mt-2">
            <div
              class={`flex items-center gap-2.5 ${
                l?.basics?.oldPriceSize === "Normal" ? "lg:flex-row" : ""
              } ${align === "center" ? "justify-center" : "justify-start"}`}
            >
              <p
                class={`line-through text-base-300 text-xs ${
                  l?.basics?.oldPriceSize === "Normal" ? "lg:text-xl" : ""
                }`}
              >
                {formatPrice(listPrice, offers!.priceCurrency!)}
              </p>
              <p class="text-emphasis text-sm font-bold">
                {formatPrice(price, offers!.priceCurrency!)}
              </p>
            </div>
            {l?.hide.installments
              ? ""
              : (
                <div class="text-xs font-normal text-base-content mt-[5px]">
                  ou {installment?.billingDuration}x de ${formatPrice(
                    installment?.billingIncrement,
                    offers!.priceCurrency!,
                  )}
                </div>
              )}
          </div>
        )}

        {/* SKU Selector */}
        {l?.elementsPositions?.skuSelector === "Bottom" && (
          <>
            {l?.hide.skuSelector ? "" : (
              <ul
                class={`flex items-center gap-2 w-full ${
                  align === "center" ? "justify-center" : "justify-start"
                } ${l?.onMouseOver?.showSkuSelector ? "lg:hidden" : ""}`}
              >
                {skuSelector}
              </ul>
            )}
          </>
        )}

        <div
          class={`w-full flex flex-col mt-[10px]
          ${
            l?.onMouseOver?.showSkuSelector || l?.onMouseOver?.showCta
              ? "transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
              : "lg:hidden"
          }
        `}
        >
          {l?.onMouseOver?.showCta && cta}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
