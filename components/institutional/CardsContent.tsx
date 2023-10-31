export interface Props {
  cards: {
    heading: {
      title: string;
    };
    content: {
      subtitle?: string;
      paragraphs?: string;
    };
    links: {
      label: string;
      url: string;
    }[];
    // Adicione este novo campo para aceitar as cidades
    cidades: {
      nome: string;
      endereco: string;
      cidade: string;
      estado: string;
      telefone: {
        label: string;
        url: string;
      };
      mapa: string;
    }[];
  }[];
  
}

function CardsContent({ cards }: Props) {
  return (
    <div class="grid grid-cols-1 gap-[48px] mt-8 overflow-hidden hover:overflow-y-auto">
      {cards.map((card) => (
          <div class="card-body p-0 gap-3">
            <div class="flex items-center h-6 text-[#174C67]">
              {/* <Icon id={card.heading.icon ?? "MapPin"} width={24} height={24} /> */}
              <h6 class="font-medium text-[18px]">{card.heading.title}</h6>
            </div>
            <div className="flex flex-col">
              <div class="flex flex-row text-[16px] text-[#66628C]">
                {/* <span class="font-bold">{card.content.subtitle}</span> */}
                <p>{card.content.paragraphs}</p>
              </div>
              <div class="flex flex-row gap-[6px] items-center font-bold text-[#66628C] text-[16px]">
              <span class="font-medium">{"Telefone:"}</span>
                {card.links.map((link) => (
                  <a href={link.url} class="font-normal flex gap-[10px] text-[16px]">
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
              <a href="" class="font-medium text-[#66628C]">Ver no Mapa</a>
            </div>
          </div>
      ))}
    </div>
  );
}

export default CardsContent;
