import type { Store } from "$store/components/institutional/InstitutionalPage.tsx";

export default async function searchStores(): Promise<Store[]> {
  const URL = "https://tezm99.vtexcommercestable.com.br/";

  const a = new Headers({
    Accept: "application/vnd.vtex.ds.v10+json",
    "Content-Type": "application/json",
    "REST-Range": "resources=0-500",
  });

  const response = await fetch(
    URL +
      "/api/dataentities/NL/search?_fields=nome,endereco,cidade,estado,contato,mapa",
    {
      method: "GET",
      headers: a,
    },
  );

  const result = await response.json();

  return result ?? [];
}
