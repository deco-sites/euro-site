import { Product } from "apps/commerce/types.ts";
import useSellers from "$store/islands/UseSellers.tsx";

import ProductCard from "./ProductCard.tsx";

export interface Columns {
  mobile?: number;
  desktop?: number;
}

export interface Props {
  products: Product[] | null;
}

function ProductGallery({ products }: Props) {
  const { sellerId, regionId } = useSellers();

  return (
    <div class="grid grid-cols-1 gap-2 items-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
      {products?.map((product, index) => (
        <ProductCard
          product={product}
          preload={index === 0}
          layout={{
            discount: { label: "OFF", variant: "accent" },
            hide: { skuSelector: true, productDescription: true },
            basics: { contentAlignment: "Center" },
          }}
          sellerId={sellerId}
          regionId={regionId}
        />
      ))}
    </div>
  );
}

export default ProductGallery;
