import Icon, { AvailableIcons } from "$store/components/ui/Icon.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import FooterSectionList, { FooterSectionItem } from "./Payments.tsx";
import SocialNetWorks, { SocialItem } from "./SocialNetWorks.tsx";

export type IconItem = { icon: AvailableIcons };
export type StringItem = {
  label: string;
  href: string;
};

export type Item = StringItem | IconItem;

export type Section = {
  label: string;
  children: Item[];
};

const isIcon = (item: Item): item is IconItem =>
  // deno-lint-ignore no-explicit-any
  typeof (item as any)?.icon === "string";

function SectionItem({ item }: { item: Item }) {
  return (
    <span>
      {isIcon(item)
        ? (
          <div class="border border-solid py-3 px-2.5">
            <Icon
              id={item.icon}
              width={25}
              height={20}
              strokeWidth={0.01}
            />
          </div>
        )
        : (
          <a
            href={item.href}
            class="max-md:text-sm text-xs font-normal text-base-300 hover:text-emphasis transition-all duration-500"
          >
            {item.label}
          </a>
        )}
    </span>
  );
}

export interface SecuritiesItem {
  image: LiveImage;
}

export interface FooterImage {
  image: LiveImage;
  alt: string;
  label: string;
}

export interface Props {
  sections?: Section[];
  /**
   * @title Social Network
   */
  socialNetWorks?: SocialItem[];
  /**
   * @title Phone number
   */
  phone: string;
  /**
   * @title E-mail
   */
  email: string;
  /**
   * @title Opening hours
   * @format html
   * @default Seg. à Sex. das 09:00h às 18:00h <br /> Sábado das 10:00h às 14:00h
   */
  openingHours: string;
  /**
   * @title Payments
   */
  payments?: FooterSectionItem[];
  /**
   * @title Securities
   */
  securities?: FooterSectionItem[];
  /**
   * @title Poweredby
   */
  poweredby?: FooterImage[];
}

function Footer(
  {
    sections = [],
    socialNetWorks,
    openingHours,
    email,
    phone,
    payments,
    securities,
    poweredby,
  }: Props,
) {
  return (
    <footer class="">
      <div class="bg-white flex flex-col">
        <div class="flex items-start justify-start gap-8 mt-12 max-lg:flex-col">
          <div class="pt-11 px-8 pb-10 max-lg:w-full bg-[#F7F7F7] rounded-[10px]">
            <Icon id="Logo" width={120} height={30} />
            {socialNetWorks?.length && (
              <SocialNetWorks socialItems={socialNetWorks} />
            )}
            <div class="flex items-center gap-2 mt-5">
              <Icon id="Phone" width={20} height={20} class="text-emphasis" />
              <span class="text-emphasis text-xs font-bold text-left">
                {phone}
              </span>
            </div>
            <div class="flex items-center gap-2 mt-3">
              <Icon id="Email" width={20} height={20} class="text-emphasis" />
              <span class="text-emphasis text-xs font-bold text-left">
                {email}
              </span>
            </div>
            <span
              class="text-base-300 text-left text-xs font-normal mt-3 block leading-6"
              dangerouslySetInnerHTML={{
                __html: openingHours,
              }}
            />
          </div>
          <div class="container w-full flex flex-col">
            <ul class="max-lg:hidden flex flex-row gap-[25%] justify-start">
              {sections.map((section) => (
                <li>
                  <div>
                    <span class="text-base text-base-content font-medium">
                      {section.label}
                    </span>

                    <ul
                      class={`flex ${
                        isIcon(section.children[0]) ? "flex-row" : "flex-col"
                      } gap-1 pt-5 flex-wrap`}
                    >
                      {section.children.map((item) => (
                        <li class="leading-normal">
                          <SectionItem item={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>

            <div
              class="max-lg:flex hidden flex-col items-center justify-center relative"
              id="accordion-container--footer"
            >
              {sections.map((section) => (
                <div class="collapse collapse-plus w-full rounded-none">
                  <input
                    type="checkbox"
                    name="my-accordion-mobile--footer"
                    class="absolute left-0 w-full h-full top-0"
                  />
                  <div class="collapse-title border-b border-base-content py-2.5 text-base-content font-medium pl-0 flex items-center justify-between pr-0">
                    {section.label}
                  </div>
                  <div class="collapse-content pl-0">
                    <ul class="pt-5 pb-2">
                      {section.children.map((item) => (
                        <li class="leading-normal py-1">
                          <SectionItem item={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div class="max-md:mt-5 mt-16 flex items-end w-full justify-between max-lg:flex-col max-lg:gap-7">
              <div class="flex items-center gap-8 w-full max-md:flex-col flex-row max-md:items-start">
                <FooterSectionList label="Pagamentos" list={payments} />
                <FooterSectionList label="Segurança" list={securities} />
              </div>

              <ul class="flex items-center w-full lg:w-auto max-lg:justify-center flex-wrap gap-8">
                {poweredby?.map((item) => (
                  <li class="flex items-center gap-2">
                    <span class="text-neutral text-[10px]">
                      {item.label}
                    </span>
                    <img
                      src={item.image}
                      alt={item.alt}
                      width={89}
                      height={20}
                      class="w-auto h-auto"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
