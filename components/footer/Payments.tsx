import type { Image as LiveImage } from "deco-sites/std/components/types.ts";

export interface FooterSectionItem {
  image?: LiveImage;
  alt: string;
}

export interface FooterSectionList {
  list: FooterSectionItem[] | undefined;
  label: string;
}

export default function FooterSectionList({ list, label }: FooterSectionList) {
  if (!list?.length) {
    return null;
  }

  return (
    <div>
      <span class="text-base text-base-content font-medium max-md:text-content-primary">
        {label}
      </span>
      <ul class="flex flex-wrap gap-2 pt-5">
        {list.map((item) => (
          <li class="rounded flex items-center justify-center">
            <img
              loading="lazy"
              src={item.image}
              width={44}
              height={30}
              alt={item.alt || "footer image"}
              class="relative w-auto h-auto mix-blend-multiply"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
