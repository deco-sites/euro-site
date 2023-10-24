import Avatar from "$store/components/ui/Avatar.tsx";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "deco-sites/std/commerce/types.ts";

interface Props {
  product: Product;
}

function VariantSelector({ product, product: { url } }: Props) {
  const possibilities = useVariantPossibilities(product);

  return (
    <ul class="flex flex-col gap-5">
      {Object.keys(possibilities).map((name) => (
        <li class="flex flex-col gap-[10px]">
          <span class="text-xs text-base-300">{name}</span>
          <ul class="flex flex-row gap-[5px]">
            {Object.entries(possibilities[name]).map((
              [value, { urls, inStock }],
            ) => (
              <li>
                <a href={urls[0]}>
                  <Avatar
                    content={value}
                    variant={inStock ? "default" : "disabled"}
                    active={urls[0] === url}
                  />
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
