import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "apps/commerce/types.ts";

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
          {name == "Tamanho" && (
            <details class="relative">
              <summary class="cursor-pointer border-[1px] border-[#D7D7DA] p-2 rounded-lg">
                {Object.entries(possibilities[name]).filter((
                  [value, { urls }],
                ) => urls[0] === url)[0][0]}
              </summary>
              <ul class="absolute top-12 p-5 bg-white rounded-lg border-[1px] border-[#D7D7DA] z-10">
                {Object.entries(possibilities[name]).map((
                  [value, { urls, inStock }],
                ) => (
                  <li class="py-2 hover:bg-slate-200">
                    <a href={urls[0]}>
                      {value}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {name !== "Tamanho" && (
            <ul class="flex flex-row gap-[5px]">
              {Object.entries(possibilities[name]).map((
                [value, { urls, inStock }],
              ) => (
                <li
                  class={`p-2 rounded-sm ${
                    urls[0] === url
                      ? "bg-primary text-white"
                      : "bg-white text-[#344D66]"
                  }`}
                >
                  <a href={urls[0]}>
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
