import {
  BUTTON_VARIANTS,
  ButtonVariant,
} from "$store/components/minicart/Cart.tsx";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import { useId } from "preact/hooks";

export type BannerFontSizes = "Small" | "Medium" | "Large";
export type ResponsiveConditionals =
  | "Always"
  | "Desktop Only"
  | "Mobile Only"
  | "Never";

export const CONDITIONAL_RESPONSIVE_PARAMS: Record<
  ResponsiveConditionals,
  string
> = {
  "Always": "flex",
  "Desktop Only": "lg:flex max-lg:hidden",
  "Mobile Only": "max-lg:flex lg:hidden",
  "Never": "hidden",
};

export interface Banner {
  /** @description desktop otimized image */
  desktop: LiveImage;
  /** @description mobile otimized image */
  mobile: LiveImage;
  /** @description Image's alt text */
  alt: string;
  /**
   * @title Banner's text
   */
  action?: {
    /** @description when user clicks on the image, go to this link */
    href?: string;
    /** @description Image text title */
    title?: string;
    /** @description Mobile title */
    mobileTitle?: string;
    /** @description Button label */
    label?: string;
    /** @description Button variant */
    variant?: ButtonVariant;
    /**
     * @title Title color
     * @default #fff
     */
    color?: string;
  };
}

export interface Props {
  images?: Banner[];
  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
  /**
   * @title Show pagination arrows?
   */
  showPaginationArrows?: ResponsiveConditionals;
  /**
   * @title Show pagination dots?
   * @default Always
   */
  showPaginationDots?: ResponsiveConditionals;
}

interface BannerTitleProps {
  title?: string;
  class?: string;
  color?: string;
}

function BannerTitle(props: BannerTitleProps) {
  return (
    <span
      class={`w-full text-center font-medium text-6xl lg:text-[100px] xl:text-[120px] text-base-100 md:whitespace-nowrap lg:leading-[100px] xl:leading-[120px] ${props.class}`}
      style={{
        color: props.color ? props.color : "#fff",
        textShadow: "0px 10px 30px rgba(21, 25, 90, 0.5)",
      }}
    >
      {props.title}
    </span>
  );
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const {
    alt,
    mobile,
    desktop,
    action,
  } = image;

  return (
    <a
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative h-[600px] overflow-y-hidden w-full"
    >
      <Picture preload={lcp}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={360}
          height={300}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={720}
          height={300}
        />
        <img
          class="object-cover w-full h-full"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>
      {action && (
        <div class="w-full absolute top-0 bottom-0 m-auto right-0 sm:right-auto left-[50%] max-h-min flex flex-col gap-4 p-4 -translate-x-1/2">
          {action?.mobileTitle
            ? (
              <BannerTitle
                class="md:hidden"
                color={action.color}
                title={action.mobileTitle}
              />
            )
            : null}

          <BannerTitle
            class={action?.mobileTitle ? "max-md:hidden" : "flex"}
            color={action.color}
            title={action.title}
          />

          <Button
            class={`max-md:text-sm m-auto btn border-none text-white capitalize font-medium text-base w-fit px-16 btn-${
              action.variant
                ? BUTTON_VARIANTS[action.variant]
                : BUTTON_VARIANTS["primary"]
            }`}
          >
            {action.label}
          </Button>
        </div>
      )}
    </a>
  );
}

interface DotsProps {
  images?: Banner[];
  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  interval?: number;
  /**
   * @title Show pagination arrows?
   */
  className: string;
}

function Dots({ images, className, interval = 0 }: DotsProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @property --dot-progress {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
          }
          `,
        }}
      />
      <ul
        class={`carousel justify-center col-span-full gap-2 z-10 row-start-4 ${className}`}
      >
        {images?.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="py-5">
                <div
                  class="w-3 h-3 group-disabled:opacity-100 opacity-20 rounded-full bg-base-100"
                  style={{ animationDuration: `${interval}s` }}
                />
              </div>
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}

interface ButtonsProps {
  className: string;
}

function Buttons({ className }: ButtonsProps) {
  return (
    <>
      <div
        class={`flex items-center justify-center z-10 col-start-1 row-start-2 ${className}`}
      >
        <Slider.PrevButton class="btn btn-circle border-none bg-opacity-10 bg-white hover:bg-white hover:bg-opacity-20">
          <Icon
            class="text-base-100"
            size={40}
            id="ChevronLeft"
            strokeWidth={3}
          />
        </Slider.PrevButton>
      </div>
      <div
        class={`flex items-center justify-center z-10 col-start-3 row-start-2 ${className}`}
      >
        <Slider.NextButton class="btn btn-circle border-none bg-opacity-10 bg-white hover:bg-white hover:bg-opacity-20">
          <Icon
            class="text-base-100"
            size={40}
            id="ChevronRight"
            strokeWidth={3}
          />
        </Slider.NextButton>
      </div>
    </>
  );
}

function BannerCarousel(
  { images, preload, interval, showPaginationArrows, showPaginationDots }:
    Props,
) {
  const id = useId();

  return (
    <div
      id={id}
      class="grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px]"
    >
      <Slider class="carousel carousel-center w-full col-span-full row-span-full scrollbar-none gap-6">
        {images?.map((image, index) => (
          <Slider.Item index={index} class="carousel-item w-full">
            <BannerItem image={image} lcp={index === 0 && preload} />
          </Slider.Item>
        ))}
      </Slider>

      <Buttons
        className={CONDITIONAL_RESPONSIVE_PARAMS[
          showPaginationArrows ? showPaginationArrows : "Always"
        ]}
      />

      <Dots
        images={images}
        interval={interval}
        className={CONDITIONAL_RESPONSIVE_PARAMS[
          showPaginationDots ? showPaginationDots : "Always"
        ]}
      />

      <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default BannerCarousel;
