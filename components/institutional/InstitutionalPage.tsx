import { Head } from "$fresh/runtime.ts";
import { Image } from "deco-sites/std/components/types.ts";

import { useState } from "preact/hooks";

export interface Store {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  contato: string;
  mapa: string;
}

export interface Props {
  Banner?: {
    bannerHero?: Image;
    bannerHeroMobile?: Image;
    titleImg?: string;
  }
  title: string;
  storesFromMasterData: Store[];
}

function InstitutionalPage({
  title,
  Banner = {
    bannerHero: "",
    bannerHeroMobile: "",
    titleImg: "",
  },
  storesFromMasterData,
}: Props) {


  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  
  const states: string[] = [];
  const cities: string[] = [];
  storesFromMasterData.forEach((store) => {
    if (!states.includes(store.estado)) states.push(store.estado);
    if (!cities.includes(store.cidade) && selectedEstado === store.estado) {
      cities.push(store.cidade);
    }
  });

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = ((e.target as HTMLSelectElement).value);
    setSelectedEstado(selectedValue);
    setSelectedCidade(""); 
    setIsCityDisabled(!selectedValue); 
  }


  const storesFiltered = storesFromMasterData.filter((store) => {
    if (store.estado === selectedEstado || selectedEstado === "") {
      if (store.cidade === selectedCidade || selectedCidade === "") {
        return store;
      }
    }
  });

  return (
    <>
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .markdown-body h2 {
              font-size: 20px;
              font-weight: 700;
              line-height: 1.4;
              margin: 0 0 20px 0;
            }
            .markdown-body h3 {
              font-size: 18px;
              font-weight: 700;
              line-height: 1.4;
              margin: 0 0 20px 0;
            }
            .markdown-body p:empty {
              display: none;
            }
            .markdown-body p:last-child {
              margin-bottom: 20px;
            }
            .markdown-body p {
              color: #8E8E9F;
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
            }
          `,
          }}
        />
      </Head>
      <div className="flex items-center justify-center flex-col lg:items-start lg:flex-row lg:justify-between lg:max-h-[859px]">
        <div class="flex relative w-full md:w-[100%] md:max-w-[579px] lg:w-[42.7%] h-full bg-[#D9D9D9] rounded-[4px]">
          <div className="flex lg:w-full md:pb-0 md:h-full">
            <picture>
              <source
                media="(max-width: 760px)"
                srcSet={Banner.bannerHeroMobile}
                className="rounded-[4px]"
              />
              <img
                className="lg:h-full md:h-full lg:w-full rounded-[4px]"
                alt={Banner.titleImg}
                src={Banner.bannerHero}
              />
            </picture>
          </div>
        </div>
        <div class="mt-16 flex flex-col max-w-[665px] lg:mt-0 lg:w-[48.6%] md:flex-row justify-between lg:max-h-[859px]">
          <article class="flex flex-col w-full gap-0">
            <div className="border-t-[3px] border-[#C82126] h-0 w-[40px] relative"></div>
            <h3 class="hidden text-secondary text-3xl font-medium pt-6 mb-8 md:block md:text-5xl leading-[60px]">
              {title}
            </h3>
            <form class="flex flex-col justify-center text-base md:text-xl bg-white border-2 border-[#174c67] p-8 md:p-9 placeholder-[#161A16] text-[#174c67]">
              <span class="text-[24px] font-medium pb-8">
                {"Qual a sua localização?"}
              </span>
              <div class="mb-4">
                <label for="estado" class="block text-[#174c67] text-sm font-normal mb-2">
                  Estado
                </label>
                <select
                  value={selectedEstado}
                  onChange={handleEstadoChange}
                  id="estado"
                  name="estado"
                  class="w-full border-2 border-[#E1E9EB] rounded-[10px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Selecione um Estado</option>
                  {states.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div class="mb-8">
                <label for="cidade" class="block text-gray-700 text-sm font-normal mb-2">
                  Cidade
                </label>
                <select
                  value={selectedCidade}
                  onChange={(e) => setSelectedCidade((e.target as HTMLSelectElement).value)}
                  id="cidade"
                  name="cidade"
                  class="w-full border-2 border-[#E1E9EB] rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isCityDisabled}
                >
                  <option value="">Selecione uma Cidade</option>
                  {cities.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <button
                class="bg-[#174c67] h-[59px] text-white font-bold py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline"
                type="button"
              >
                Buscar
              </button>
            </form>
            <span class="mt-10 text-[24px] leading-8 font-medium">
              {"Resultados Encontrados"}
            </span>
            {selectedEstado && (
            <div class="grid grid-cols-1 gap-[48px] mt-8 overflow-hidden hover:overflow-y-auto">
              {storesFiltered.map((store, index) => (
                <div class="card-body p-0 gap-3">
                  <div class="flex items-center h-6 text-[#174C67]">
                    <h6 class="font-medium text-[18px]">{store.nome}</h6>
                  </div>
                  <div className="flex flex-col">
                    <div class="flex flex-row text-[16px] text-[#66628C]">
                      <p>{store.endereco} - {store.cidade}, {store.estado}</p>
                    </div>
                    <div class="flex flex-row gap-[6px] items-center font-bold text-[#66628C] text-[16px]">
                    <span class="font-medium">{"Telefone:"}</span>
                        <a href="" target="blank" class="font-normal flex gap-[10px] text-[16px]">
                          <span>{store.contato}</span>
                        </a>
                    </div>
                    <a href={store.mapa} class="font-medium text-[#66628C]">Ver no Mapa</a>
                  </div>
                </div>
              ))}
            </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
}

export default InstitutionalPage;
