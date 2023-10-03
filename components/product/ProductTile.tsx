import type { Product } from "apps/commerce/types.ts";
import Image from "deco-sites/std/components/Image.tsx";
import { relative } from "./ProductCard.tsx";

interface Props {
  product: Product;
  imageWidth: number;
  imageHeight: number;
  preload: boolean;
}

export default function ProductTile(
  { product, imageHeight, imageWidth, preload }: Props,
) {
  const { image: images, url, name } = product;
  const [first] = images ?? [];

  return (
    <div class="flex items-center justify-start gap-4">
      <a
        href={url && relative(url)}
        aria-label="view product"
        class="w-full h-full flex items-center gap-2 hover:text-emphasis"
      >
        <div class="bg-[#f6f6f6] rounded-md">
          <Image
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
            }}
            src={first.url!}
            alt={first.alternateName}
            width={imageWidth}
            height={imageHeight}
            class="rounded w-full opacity-100 mix-blend-multiply"
            preload={preload}
            loading={preload ? "lazy" : "eager"}
            decoding="async"
          />
        </div>
        <h2 class="text-xs items-center text-base-content font-bold">{name}</h2>
      </a>
    </div>
  );
}
