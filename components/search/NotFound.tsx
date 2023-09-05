import type { SectionProps } from "$live/mod.ts";
import Icon from "$store/components/ui/Icon.tsx";
import Searchbar from "$store/components/search/Searchbar.tsx";

export interface Props {
  /**
   * @description Title to be displayed in the not found section
   */
  title?: string;
  /**
   * @description Description to be displayed before the search term that caused the not found state
   * @title Search term description
   */
  termDescription?: string;
  /**
   * @description Hints for helping the user searching in a more effective way
   */
  hints?: {
    title: string;
    hints: string[];
  };
}

export const loader = (ctx: Props, req: Request) => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  const term = params.get("q");

  return {
    ...ctx,
    searchTerm: term,
  };
};

export default function NotFound({
  termDescription = "Resultados de busca encontrados para:",
  title = "Ops!",
  hints,
  searchTerm,
}: SectionProps<typeof loader>) {
  return (
    <div class="w-full">
      <div class="flex flex-col gap-[10px] lg:flex-row lg:justify-around lg:mt-[30px] lg:mb-[60px]">
        <div class="flex flex-col px-5 py-[30px] gap-5">
          <h2 class="text-emphasis font-medium text-[70px] lg:text-[130px]">
            {title}
          </h2>
          <p class="font-medium text-base-300 lg:text-xl">
            {termDescription} "{searchTerm}"
          </p>
          <div class="lg:w-[307px]">
            <Searchbar
              placeholder="Digite sua busca novamente"
              noContainer
              hide={{
                results: true,
                cleanButton: true,
              }}
              cardLayout={{
                discount: {
                  label: "OFF",
                  variant: "emphasis",
                },
                hide: {},
              }}
            />
          </div>
        </div>
        {hints && (
          <div class="bg-secondary-focus p-5 flex flex-col gap-[10px] text-white rounded-[20px] lg:relative lg:justify-center lg:p-[60px] lg:rounded-r-none">
            <div class="lg:block hidden -z-10 absolute w-full h-full bg-secondary-focus top-0 left-full">
            </div>
            <h6 class="font-medium lg:text-xl">{hints.title}</h6>
            <ul class="flex flex-col gap-3">
              {hints.hints.map((hint) => (
                <li class="text-xs lg:text-sm flex items-center gap-2">
                  <Icon
                    height={10}
                    width={10}
                    id="ChevronRight"
                    class="text-emphasis"
                  />
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
