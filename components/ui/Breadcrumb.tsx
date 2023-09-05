import type { BreadcrumbList } from "deco-sites/std/commerce/types.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
  class?: string;
}

function Breadcrumb({ class: _class, itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <div class={`breadcrumbs py-5 ${_class}`}>
      <ul class={``}>
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }) => (
            <li
              class={`text-base-300 last:text-secondary first:before:!border-none before:!border-t-emphasis before:!border-r-emphasis before:!border-r-2 before:!border-t-2 before:!opacity-100`}
            >
              <a href={item}>{name}</a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
