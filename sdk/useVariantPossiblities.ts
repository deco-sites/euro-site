import type { Product } from "deco-sites/std/commerce/types.ts";

export const useVariantPossibilities = (
  { url: productUrl, isVariantOf }: Product,
) => {
  const allProperties = (isVariantOf?.hasVariant ?? [])
    .flatMap(({ additionalProperty = [], url, offers }) =>
      additionalProperty.map((property) => ({ property, url, offers }))
    )
    .filter((x) => x.url)
    .filter((x) => x.property.valueReference === "SPECIFICATION") // Remove this line to allow other than specifications
    .sort((a, b) => a.url! < b.url! ? -1 : a.url === b.url ? 0 : 1);

  const possibilities = allProperties.reduce(
    (acc, { property, url, offers }) => {
      const { name = "", value = "" } = property;
      const inStock = offers
        ? offers.offers.reduce((acc, { availability }) => {
          if (availability === "https://schema.org/InStock" || acc) {
            return true;
          }
          return acc;
        }, false)
        : false;

      if (!acc[name]) {
        acc[name] = {};
      }

      if (!acc[name][value]) {
        acc[name][value] = { urls: [], inStock };
      }

      if (url) {
        // prefer current url first to easy selector implementation
        url === productUrl
          ? acc[name][value].urls.unshift(url)
          : acc[name][value].urls.push(url);
      }

      return acc;
    },
    {} as Record<string, Record<string, { urls: string[]; inStock: boolean }>>,
  );

  return possibilities;
};
