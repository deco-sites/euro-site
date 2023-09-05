import Icon from "$store/components/ui/Icon.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import type { INavItem } from "./NavItem.tsx";
export interface Props {
  items: INavItem[];
}

function MenuItem({ item }: { item: INavItem }) {
  const component = item?.children?.length
    ? (
      <div class="collapse collapse-plus relative items-start">
        <input
          type="checkbox"
          class="absolute left-0 w-full h-full top-0"
        />
        <div class="collapse-title min-h-0 p-0 py-2.5 font-dm-sans font-normal text-sm px-0 flex items-center justify-between">
          {item.label}
        </div>
        <div class="collapse-content px-0">
          <ul class="border-t border-base-content border-solid pt-0 px-0 pl-5">
            {item.children?.map((node) => (
              <li class="">
                <a
                  href={node.href}
                  title={node.label}
                  class={`w-full block pt-5 font-dm-sans font-normal text-base-300 text-sm ${
                    item.highlighted ? "text-secondary" : ""
                  }`}
                >
                  {node.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
    : (
      <a
        href={item.href}
        title={item.label}
        class={`w-full block py-2.5 font-dm-sans font-normal text-sm ${
          item.highlighted ? "text-secondary" : ""
        }`}
      >
        {item.label}
      </a>
    );

  return component;
}

const actionButtons = [
  {
    href: "#",
    label: "Meus dados",
  },
  {
    href: "#",
    label: "Meus pedidos",
  },
];

function Menu({ items }: Props) {
  const { displayMenu } = useUI();

  return (
    <div class="flex flex-col justify-center px-4">
      <div class="w-full flex items-center justify-between py-4 border-b border-slate-100 border-solid pb-2">
        <a
          class="flex items-center justify-start gap-1 uppercase text-base-content font-medium text-xs"
          href="/login"
        >
          <span class="p-1">
            <Icon
              id="User"
              width={24}
              height={24}
              strokeWidth={1}
              class="text-base-content"
            />
          </span>
          Entrar
        </a>
        <button
          class="btn-square btn-ghost relative flex justify-center items-center rounded-full"
          onClick={() => {
            displayMenu.value = false;
          }}
        >
          <Icon id="XMark" width={24} height={24} strokeWidth={2} />
        </button>
      </div>
      <div class="flex items-center justify-center w-full gap-2 mt-4 pb-4">
        {actionButtons.map((action) => (
          <a
            href={action.href}
            class="btn btn-secondary btn-rounded capitalize font-medium min-w-[140px]"
          >
            {action.label}
          </a>
        ))}
      </div>
      <ul class="flex-grow flex flex-col">
        {items.map((item) => <MenuItem item={item} />)}
      </ul>
    </div>
  );
}

export default Menu;
