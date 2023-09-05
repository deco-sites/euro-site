import Icon, { AvailableIcons } from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import Image from "deco-sites/std/components/Image.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";

import { useId } from "preact/hooks";

export interface Props {
  /**
   * @description Alerts available in the top nav bar
   */
  alerts: Alerts[];

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

type IconId = "" | AvailableIcons;

export interface Alerts {
  textAlert: string;
  /** @format color */
  textColor: string;
  image?: LiveImage;
  alt?: string;
  /** @default */
  idIcon?: IconId;
}

function TipItem(alert: Alerts) {
  return (
    <span>
      {alert.image
        ? (
          <Image
            src={alert.image}
            alt={alert.alt}
            width={18}
            height={18}
          />
        )
        : (
          alert.idIcon && (
            <Icon
              id={alert.idIcon}
              width={18}
              height={18}
              strokeWidth={2}
              stroke="#fff"
            />
          )
        )}
    </span>
  );
}

function TopNavBar({ alerts = [], interval = 5 }: Props) {
  const id = useId();

  return (
    <>
      {/*  mobile version */}
      <div id={id} class="overflow-hidden">
        <Slider class="carousel carousel-center gap-6 scrollbar-none lg:hidden">
          {alerts.map((alert, index) => (
            <Slider.Item index={index} class="carousel-item">
              <div class="flex justify-center items-center w-screen">
                <TipItem {...alert} />
                <span
                  class="text-[10px] h-[25px] flex items-center ml-3 lg:text-xs"
                  style={{ color: alert.textColor }}
                >
                  {alert.textAlert}
                </span>
              </div>
            </Slider.Item>
          ))}
        </Slider>

        <SliderJS rootId={id} interval={interval && interval * 1e3} />
      </div>

      {/*  desktop version */}
      <div class="h-7 max-lg:hidden">
        <div class="flex justify-center gap-28">
          {alerts.map((alert) => (
            <div class="flex items-center">
              <TipItem {...alert} />
              <span
                class="text-xs h-[25px] flex items-center ml-3"
                style={{ color: alert.textColor }}
              >
                {alert.textAlert}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TopNavBar;
