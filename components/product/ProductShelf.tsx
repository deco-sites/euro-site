import type { LoaderReturnType } from "$live/types.ts";
import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import {
  CONDITIONAL_RESPONSIVE_PARAMS,
  ResponsiveConditionals,
} from "$store/components/ui/BannerCarousel.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { Product } from "deco-sites/std/commerce/types.ts";
import { mapProductToAnalyticsItem } from "deco-sites/std/commerce/utils/productToAnalyticsItem.ts";
import { useId } from "preact/hooks";

export interface Props {
  products: LoaderReturnType<Product[] | null>;

  title?: string;
  seeMore?: {
    url: string;
    label: string;
  };
  layout?: {
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large";
    itemsPerPage?: {
      screenWidth?: number;
      itemsQuantity?: number;
    }[];
  };
  showPaginationArrows?: ResponsiveConditionals;
  cardLayout?: CardLayout;
}

function ProductShelf({
  products,
  title,
  layout,
  cardLayout,
  seeMore,
  showPaginationArrows,
}: Props) {
  const id = useId();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div class="w-full py-8 flex flex-col gap-12 lg:gap-7 lg:py-10">
      <div class="flex items-center justify-between relative pb-3 border-b border-neutral-100">
        <Header
          title={title || ""}
          description=""
          fontSize={layout?.headerfontSize || "Large"}
          alignment={layout?.headerAlignment || "center"}
        />
        {seeMore
          ? (
            <span class="text-emphasis font-normal text-sm lowercase">
              <a href={seeMore.url}>
                {seeMore.label}
              </a>
            </span>
          )
          : null}
      </div>

      <div
        id={id}
        class="grid grid-cols-[48px_1fr_48px] px-0"
      >
        <Slider class="carousel carousel-start gap-6 col-span-full row-start-2 row-end-5">
          {products?.map((product, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-[270px]"
            >
              <ProductCard
                product={product}
                itemListName={title}
                layout={cardLayout}
              />
            </Slider.Item>
          ))}
        </Slider>

        <>
          <div
            class={`relative z-10 col-start-1 row-start-3  ${
              CONDITIONAL_RESPONSIVE_PARAMS[
                showPaginationArrows ? showPaginationArrows : "Always"
              ]
            }`}
          >
            <Slider.PrevButton
              style={{
                minHeight: "28px",
              }}
              class="w-8 h-8 btn btn-circle absolute opacity-100 bg-opacity-100 lg:-left-4 left-2 bg-neutral-100 border-none hover:bg-neutral-100"
            >
              <Icon
                size={20}
                id="ChevronLeft"
                strokeWidth={3}
                class="text-base-content"
              />
            </Slider.PrevButton>
          </div>
          <div
            class={`relative z-10 col-start-3 row-start-3 ${
              CONDITIONAL_RESPONSIVE_PARAMS[
                showPaginationArrows ? showPaginationArrows : "Always"
              ]
            }`}
          >
            <Slider.NextButton
              style={{
                minHeight: "28px",
              }}
              class="w-8 h-8 min-h-fit btn btn-circle absolute opacity-100 bg-opacity-100 lg:-right-4 right-2  bg-neutral-100 border-none hover:bg-neutral-100"
            >
              <Icon
                size={20}
                id="ChevronRight"
                strokeWidth={3}
                class="text-base-content"
              />
            </Slider.NextButton>
          </div>
        </>

        <SendEventOnLoad
          event={{
            name: "view_item_list",
            params: {
              item_list_name: title,
              items: products.map((product) =>
                mapProductToAnalyticsItem({
                  product,
                  ...(useOffer(product.offers)),
                })
              ),
            },
          }}
        />
        <SliderJS
          rootId={id}
          itemsPerPage={layout?.itemsPerPage?.reduce(
            (initial, { screenWidth, itemsQuantity }) => ({
              ...initial,
              [screenWidth?.toString() ?? "0"]: itemsQuantity ?? 1,
            }),
            {},
          )}
        />
      </div>
    </div>
  );
}

export default ProductShelf;
