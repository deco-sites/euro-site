import { useId } from "preact/hooks";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Image from "deco-sites/std/components/Image.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import OutOfStock from "$store/islands/OutOfStock.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";
import AddToCartActions from "$store/islands/AddToCartActions.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { getShareLink } from "$store/sdk/shareLinks.tsx";

import DiscountBadge from "./DiscountBadge.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";

export type Variant = "front-back" | "slider" | "auto";

export type ShareableNetwork = "Facebook" | "Twitter" | "Email" | "WhatsApp";

export interface Props {
  page: LoaderReturnType<ProductDetailsPage | null>;
  /**
   * @title Product view
   * @description Ask for the developer to remove this option since this is here to help development only and should not be used in production
   */
  variant?: Variant;
  shipmentPolitics?: {
    label: string;
    link: string;
  };
  shareableNetworks?: ShareableNetwork[];
}

const WIDTH = 500;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */
function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-28">
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="font-medium text-2xl">Página não encontrada</span>
        <a href="/">
          <Button>Voltar à página inicial</Button>
        </a>
      </div>
    </div>
  );
}

function ProductInfo(
  { page, shipmentPolitics, shareableNetworks }: {
    page: ProductDetailsPage;
    shipmentPolitics?: Props["shipmentPolitics"];
    shareableNetworks?: Props["shareableNetworks"];
  },
) {
  const {
    breadcrumbList,
    product,
  } = page;
  const {
    description,
    productID,
    offers,
    name,
    gtin,
    isVariantOf,
    url,
  } = product;
  const { price, listPrice, seller, installments, availability } = useOffer(
    offers,
  );

  return (
    <>
      {/* Code and name */}
      <div class="mt-4 sm:mt-0">
        <h1>
          <span class="font-medium text-base-content text-2xl">
            {name}
          </span>
        </h1>
        <div>
          <span class="text-sm text-base-300">
            Código: {gtin}
          </span>
        </div>
      </div>
      {/* Prices */}
      <div class="mt-5">
        <div class="flex flex-row gap-2 items-center">
          {listPrice !== price && (
            <span class="line-through text-base-300 text-xs">
              {formatPrice(listPrice, offers!.priceCurrency!)}
            </span>
          )}
          <span class="font-medium text-3xl text-emphasis">
            {formatPrice(price, offers!.priceCurrency!)}
          </span>
        </div>
        <span>
          {installments}
        </span>
      </div>
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-5">
        <ProductSelector product={product} />
      </div>
      {/* Add to Cart and Favorites button */}
      <div class="mt-4 lg:mt-10 flex gap-[30px]">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              {seller && (
                <AddToCartActions
                  productID={productID}
                  seller={seller}
                  price={price}
                  listPrice={listPrice}
                  productName={name ?? ""}
                  productGroupID={product.isVariantOf?.productGroupID ?? ""}
                />
              )}
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
      {/* Description card */}
      <details className="collapse collapse-plus border-b border-neutral rounded-none">
        <summary className="collapse-title px-0">
          Detalhes do produto
        </summary>
        <div className="readmore text-xs px-0 leading-tight collapse-content text-base-300">
          <input type="checkbox" id="readmore" className="readmore-toggle" />
          <label htmlFor="readmore" className="readmore-label my-2 block">
            + Ler mais
          </label>
          <p className="readmore-content">{description}</p>
        </div>
      </details>
      {/* Shipping Simulation */}
      <div className="collapse collapse-plus">
        <input type="checkbox" />
        <div className="collapse-title px-0">
          Calcular frete e entrega
        </div>
        <div className="collapse-content px-0">
          <ShippingSimulation
            items={[{
              id: Number(product.sku),
              quantity: 1,
              seller: seller ?? "1",
            }]}
            shipmentPolitics={shipmentPolitics}
          />
        </div>
      </div>
      {/* Share Product on Social Networks */}
      {shareableNetworks && (
        <div class="flex items-center gap-5 my-5">
          <span class="text-xs text-base-300">Compartilhar</span>
          <ul class="gap-2 flex items-center justify-between">
            {shareableNetworks.map((network) => (
              <li class="bg-base-300 w-8 h-8 rounded-full hover:bg-emphasis transition-all">
                <a
                  href={getShareLink({
                    network,
                    productName: isVariantOf?.name ?? name ?? "",
                    url: url ?? "",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center w-full h-full text-neutral-100"
                >
                  <Icon id={network} width={20} height={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analytics Event */}
      <SendEventOnLoad
        event={{
          name: "view_item",
          params: {
            items: [
              mapProductToAnalyticsItem({
                product,
                breadcrumbList,
                price,
                listPrice,
              }),
            ],
          },
        }}
      />
    </>
  );
}

/**
 * Here be dragons
 *
 * bravtexfashionstore (VTEX default fashion account) has the same images for different skus. However,
 * VTEX api does not return the same link for the same image. This causes the image to blink when
 * the user changes the selected SKU. To prevent this blink from happening, I created this function
 * bellow to use the same link for all skus. Example:
 *
 * {
    skus: [
      {
        id: 1
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/123/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/124/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/125/c.jpg"
        ]
      },
      {
        id: 2
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
        ]
      }
    ]
  }

  for both skus 1 and 2, we have the same images a.jpg, b.jpg and c.jpg, but
  they have different urls. This function returns, for both skus:

  [
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
  ]

  This is a very catalog dependent function. Feel free to change this as you wish
 */
const useStableImages = (product: ProductDetailsPage["product"]) => {
  const imageNameFromURL = (url = "") => {
    const segments = new URL(url).pathname.split("/");
    return segments[segments.length - 1];
  };

  const images = product.image ?? [];
  const allImages = product.isVariantOf?.hasVariant.flatMap((p) => p.image)
    .reduce((acc, img) => {
      if (img?.url) {
        acc[imageNameFromURL(img.url)] = img.url;
      }
      return acc;
    }, {} as Record<string, string>) ?? {};

  return images.map((img) => {
    const name = imageNameFromURL(img.url);

    return { ...img, url: allImages[name] ?? img.url };
  });
};

function ProductDescription({ description }: { description?: string }) {
  return (
    <div className="readmore px-0 text-base">
      {description || 'Descrição não disponível.'}
    </div>
  );
}

function ProductDescriptionSection({ product }: { product: ProductDetailsPage['product'] }) {
  return (
    <div className="product-description-section py-10 px-2 text-[#66628C]">
      <div className="collapse-title px-0">
          Detalhes do produto
      </div>
      <div className="container mx-auto">
        <ProductDescription description={product?.description} />
      </div>
    </div>
  );
}

function ProductFeaturesSection({ features }: { features: Array<{ image: string; title: string; subtitle: string }> }) {
  return (
    <div className="product-features-section">
      <div className="container mx-auto py-10">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col lg:flex-row mb-4 py-10 gap-24">
            {/* Imagem */}
            <div className={`lg:w-1/2 lg:order-${index % 2 === 0 ? '1' : '2'}`}>
              <img src={feature.image} alt={`Feature ${index + 1}`} className="w-full max-h-[457px]" />
            </div>

            {/* Título e Subtítulo */}
            <div className={`lg:w-1/2 lg:order-${index % 2 === 0 ? '2' : '1'}`}>
              <div className="feature-text-container relative pt-2">
                {/* Borda superior */}
                <div className={`border-t-2 border-[#174C67] w-[43%] absolute top-0 ${
                    index % 2 === 0 ? 'right-0' : 'left-0'
                  }`}></div>

                {/* Título e Subtítulo */}
                <div
                  className={`max-w-[433px] ${
                    index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'
                  }`}
                >
                    <h2 className="text-5xl leading-[76px] font-medium py-4">{feature.title}</h2>
                    <p className="text-base-300 leading-[26px]">{feature.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function Details({
  page,
  variant,
  shipmentPolitics,
  shareableNetworks,
}: {
  page: ProductDetailsPage;
  variant: Variant;
  shipmentPolitics?: Props["shipmentPolitics"];
  shareableNetworks?: Props["shareableNetworks"];
}) {
  const { product, breadcrumbList } = page;
  const { offers } = product;
  const {
    price,
    listPrice,
  } = useOffer(offers);
  const id = `product-image-gallery:${useId()}`;
  const images = useStableImages(product);

  const features = [
    {
      image: 'https://www.eurocolchoes.com/live/invoke/deco-sites/std/loaders/x/image.ts?src=https%3A%2F%2Fozksgdmyrqcxcwhnbepg.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fassets%2F2353%2F3d6c66b0-25c4-4899-94cd-6ecb9690cf29&fit=cover&width=768&height=454&__frsh_c=4881070e82058f1c1e16a40ea9109c4185f16aa5',
      title: 'Linha Euro',
      subtitle: 'A Linha Euro da Euro Colchões é uma coleção de produtos premium que oferece conforto e qualidade excepcionais.',
    },
    {
      image: 'https://img.freepik.com/fotos-premium/mulher-atraente-e-alegre-de-pijama-usando-o-celular-e-sorrindo-enquanto-esta-deitada-na-cama-depois-de-dormir-ou-cochilar_171337-94241.jpg',
      title: 'Conforto macio',
      subtitle: 'Sensação de maciez para quem não abre mão do alinhamento da coluna vertebral.',
    },
    {
      image: 'https://static3.tcdn.com.br/img/img_prod/1083165/colchao_solteiro_molas_ensacadas_new_connect_firme_fortezza_88x188_6821_3_b055924db2d080b51fc311da236f3bb9.jpg',
      title: 'Euro Probiotic',
      subtitle: 'O mais avançado neutralizador de ácaros do mundo, que usa probióticos naturais diretamente na malha para higienizar o colchão e evitar alergias.',
    },
  ];

  /**
   * Product slider variant
   */
  if (variant === "slider") {
    return (
      <>
        {/* Breadcrumb */}
        <Breadcrumb
          itemListElement={breadcrumbList?.itemListElement.slice(0, -1)}
        />
        <div
          id={id}
          class="flex flex-col lg:flex-row gap-4 lg:justify-center pb-10"
        >
          {/* Product Images */}
          <div class="flex flex-col xl:flex-row-reverse relative lg:items-start gap-4">
            {/* Image Slider */}
            <div class="relative xl:pl-32">
              <Slider class="carousel carousel-center gap-6 box-border lg:box-content lg:w-[500px] xl:w-[600px] w-full px-4 lg:px-0">
                {images.map((img, index) => (
                  <Slider.Item
                    index={index}
                    class="carousel-item w-full"
                  >
                    <Image
                      class="w-full rounded-[10px]"
                      sizes="(max-width: 640px) 100vw, 40vw"
                      style={{ aspectRatio: ASPECT_RATIO }}
                      src={img.url!}
                      alt={img.alternateName}
                      width={WIDTH}
                      height={HEIGHT}
                      // Preload LCP image for better web vitals
                      preload={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </Slider.Item>
                ))}
              </Slider>

              {/* Discount tag */}
              {price && listPrice && price !== listPrice
                ? (
                  <DiscountBadge
                    price={price}
                    listPrice={listPrice}
                    className="lg:left-auto lg:right-0 left-4"
                  />
                )
                : null}
            </div>

            {/* Dots */}
            <div class="lg:max-w-[500px] lg:self-start xl:self-start xl:left-0 xl:absolute xl:max-h-full xl:overflow-y-scroll xl:scrollbar-none">
              <ul
                class={`flex gap-4 overflow-auto lg:max-h-min lg:flex-1 lg:justify-start xl:flex-col`}
              >
                {images.map((img, index) => (
                  <li class="min-w-[75px] lg:h-fit lg:min-w-[100px]">
                    <Slider.Dot index={index}>
                      <Image
                        style={{ aspectRatio: ASPECT_RATIO }}
                        class="border-neutral hover:border-secondary-focus group-disabled:border-secondary-focus border-2 rounded-[10px]"
                        width={WIDTH / 5}
                        height={HEIGHT / 5}
                        src={img.url!}
                        alt={img.alternateName}
                      />
                    </Slider.Dot>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Info */}
          <div class="w-full lg:pr-0 lg:pl-6">
            <ProductInfo
              page={page}
              shipmentPolitics={shipmentPolitics}
              shareableNetworks={shareableNetworks}
            />
          </div>
        </div>
        <SliderJS rootId={id}></SliderJS>
        <ProductDescriptionSection product={product} />
        <div class="bg-[#69808B] text-white p-10">
        <div class="flex flex-row gap-3 items-center pb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
          <defs>
            <clipPath id="clip-path">
              <rect id="Retângulo_510" data-name="Retângulo 510" width="16.969" height="21.432" fill="#69808b"/>
            </clipPath>
          </defs>
          <g id="icon-super-garantia-desktop" transform="translate(-895 -268)">
            <rect id="Stroke" width="38" height="38" rx="19" transform="translate(895 268)" fill="#f7f8fa"/>
            <g id="Grupo_1576" data-name="Grupo 1576" transform="translate(905.581 276.597)">
              <g id="Grupo_1576-2" data-name="Grupo 1576" clip-path="url(#clip-path)">
                <path id="Caminho_2090" data-name="Caminho 2090" d="M238.223,277.333a3.561,3.561,0,0,0-1.786,6.648v2.53a.644.644,0,0,0,1.1.455l.687-.686.687.686a.644.644,0,0,0,1.1-.455v-2.53a3.561,3.561,0,0,0-1.786-6.648Z" transform="translate(-224.828 -265.723)" fill="#69808b"/>
                <path id="Caminho_2091" data-name="Caminho 2091" d="M8.037,15.182a5.352,5.352,0,0,1,8.037-4.636V4.465A4.471,4.471,0,0,0,11.61,0H4.465A4.471,4.471,0,0,0,0,4.465V15.182a4.471,4.471,0,0,0,4.465,4.465H9.824v-.482a5.336,5.336,0,0,1-1.786-3.983M4.465,3.572H11.61a.893.893,0,0,1,0,1.786H4.465a.893.893,0,1,1,0-1.786m0,3.572H11.61a.893.893,0,0,1,0,1.786H4.465a.893.893,0,0,1,0-1.786M7.144,12.5H4.465a.893.893,0,0,1,0-1.786H7.144a.893.893,0,0,1,0,1.786" fill="#69808b"/>
              </g>
            </g>
          </g>
      </svg><p class="text-2xl">Super garantia</p></div>
          <p>3 anos no molejo, 3 anos no estofamento e 90 dias no tecido, a melhor garantia do mercado. Faça você também o teste de qualidade.</p>
        </div>
        {/* Seção de Características */}
        <ProductFeaturesSection features={features} />
      </>
    );
  }

  /**
   * Product front-back variant.
   *
   * Renders two images side by side both on mobile and on desktop. On mobile, the overflow is
   * reached causing a scrollbar to be rendered.
   */
  return (
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[50vw_25vw] lg:grid-rows-1 lg:justify-center">
      {/* Image slider */}
      <ul class="carousel carousel-center gap-6">
        {[images[0], images[1] ?? images[0]].map((img, index) => (
          <li class="carousel-item min-w-[100vw] lg:min-w-[24vw]">
            <Image
              sizes="(max-width: 640px) 100vw, 24vw"
              style={{ aspectRatio: ASPECT_RATIO }}
              src={img.url!}
              alt={img.alternateName}
              width={WIDTH}
              height={HEIGHT}
              // Preload LCP image for better web vitals
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>

      {/* Product Info */}
      <div class="px-4 lg:pr-0 lg:pl-6">
        <ProductInfo page={page} />
      </div>
    </div>
  );
}

function ProductDetails(
  { page, variant: maybeVar = "auto", shipmentPolitics, shareableNetworks }:
    Props,
) {
  /**
   * Showcase the different product views we have on this template. In case there are less
   * than two images, render a front-back, otherwhise render a slider
   * Remove one of them and go with the best suited for your use case.
   */
  const variant = maybeVar === "auto"
    ? page?.product.image?.length && page?.product.image?.length < 2
      ? "front-back"
      : "slider"
    : maybeVar;

  return (
    <div class="py-0 lg:pb-10">
      {page
        ? (
          <Details
            page={page}
            variant={variant}
            shipmentPolitics={shipmentPolitics}
            shareableNetworks={shareableNetworks}
          />
        )
        : <NotFound />}
    </div>
  );
}

export default ProductDetails;
