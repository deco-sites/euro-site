import { useMemo } from "preact/hooks";
import { ProductListingPage } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";

const SORT_QUERY_PARAM = "sort";

const useSort = () =>
  useMemo(() => {
    const urlSearchParams = new URLSearchParams(window.location?.search);
    return urlSearchParams.get(SORT_QUERY_PARAM) ?? "";
  }, []);

// TODO: Replace with "search utils"
const applySort = (searchParam: string) => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  urlSearchParams.set(SORT_QUERY_PARAM, searchParam);
  window.location.search = urlSearchParams.toString();
};

const labels = {
  "relevance:desc": "Relevância",
  "price:asc": "Menor preço",
  "price:desc": "Maior preço",
  "name:asc": "A - Z",
  "name:desc": "Z - A",
  "release:desc": "Data de lançamento",
  "orders:desc": "Mais vendidos",
  "discount:desc": "Melhor desconto",
};

type LabelKey = keyof typeof labels;

export type Props = Pick<ProductListingPage, "sortOptions">;

function Sort({ sortOptions }: Props) {
  const sort = useSort();

  return (
    <div
      id="sort"
      name="sort"
      class="dropdown dropdown-end w-full lg:auto"
    >
      <label
        tabIndex={0}
        class="btn justify-between w-full lg:w-48 btn-sm font-normal text-base-200 h-[34px] border-2 border-base-200 bg-white hover:bg-white"
      >
        {sort
          ? <span class="text-base-content">{labels[sort as LabelKey]}</span>
          : "Selecione"}
        <Icon
          id="ChevronDown"
          height={22}
          width={22}
          strokeWidth={2}
          class="text-base-content"
        />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content mt-[10px] z-[1] px-0 py-[10px] menu shadow bg-base-100 rounded-[10px] w-48"
      >
        {sortOptions.map(({ value, label }) => (
          <li
            class="text-sm h-9 hover:cursor-pointer px-5 hover:bg-neutral-200 flex justify-center"
            onClick={() => applySort(value)}
          >
            {labels[label as LabelKey]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sort;
