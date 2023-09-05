import { IS_BROWSER } from "$fresh/runtime.ts";
import Button from "$store/components/ui/Button.tsx";
import Icon, { AvailableIcons } from "$store/components/ui/Icon.tsx";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

// Lazy load a <dialog> polyfill.
if (IS_BROWSER && typeof window.HTMLDialogElement === "undefined") {
  await import(
    "https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
  );
}

export type Props = JSX.IntrinsicElements["dialog"] & {
  title?: string;
  mode?: "sidebar-right" | "sidebar-left" | "center";
  onClose?: () => Promise<void> | void;
  loading?: "lazy" | "eager";
  menuIcon?: AvailableIcons;
  showHeader?: boolean;
};

const dialogStyles = {
  "sidebar-right": "animate-slide-left",
  "sidebar-left": "animate-slide-right",
  center: "animate-fade-in",
};

const sectionStyles = {
  "sidebar-right": "justify-end",
  "sidebar-left": "justify-start",
  center: "justify-center items-center",
};

const containerStyles = {
  "sidebar-right": "h-full w-full sm:max-w-lg",
  "sidebar-left": "h-full w-full sm:max-w-lg",
  center: "",
};

const Modal = ({
  open,
  title,
  mode = "sidebar-right",
  onClose,
  children,
  loading,
  menuIcon,
  showHeader,
  ...props
}: Props) => {
  const lazy = useSignal(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open === false) {
      document
        .getElementsByTagName("body")
        .item(0)
        ?.classList.remove("no-scroll");
      ref.current?.open === true && ref.current.close();
    } else if (open === true) {
      document.getElementsByTagName("body").item(0)?.classList.add("no-scroll");
      ref.current?.open === false && ref.current.showModal();
      lazy.value = true;
    }
  }, [open]);

  return (
    <dialog
      {...props}
      ref={ref}
      class={`backdrop:bg-black backdrop:opacity-80 bg-transparent p-0 m-0 max-w-[87.5%] w-full max-h-full h-full backdrop-opacity-50 lg:max-w-[33%] ${
        dialogStyles[mode]
      } ${props.class ?? ""}`}
      onClick={(e) =>
        (e.target as HTMLDialogElement).tagName === "SECTION" && onClose?.()}
      onClose={onClose}
    >
      <section
        class={`w-full h-full flex bg-transparent ${sectionStyles[mode]}`}
      >
        <div
          class={`w-full bg-base-100 flex flex-col max-h-full overflow-auto ${
            containerStyles[mode]
          }`}
        >
          {showHeader && (
            <header class="mx-5 mt-4 mb-[10.5px] flex items-center justify-between border-solid border-b-[1px] border-[#F7F7F7] lg:mx-10">
              <h1 className="flex items-center justify-between gap-1">
                <span class="font-medium text-base-content lg:text-xl text-xl">
                  {title}
                </span>
              </h1>
              <Button
                class="btn btn-ghost p-0 flex justify-center w-12 h-4"
                onClick={onClose}
              >
                <Icon
                  class="text-base-content"
                  id="XMark"
                  width={25}
                  height={25}
                  strokeWidth={2}
                />
              </Button>
            </header>
          )}
          <div class="flex-grow flex flex-col w-full">
            {loading === "lazy" ? lazy.value && children : children}
          </div>
        </div>
      </section>
    </dialog>
  );
};

export default Modal;
