import { useState } from 'preact/hooks';
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";

async function getAddressByPostalCode(postalCode: string) {
  try {
    const res = await fetch(`/api/checkout/pub/postal-code/BRA/${postalCode}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.error("Error getting address by postal code: ", { err })
  }
}

const expectedOrderFormSections = [
  "items",
  "totalizers",
  "clientProfileData",
  "shippingData",
  "paymentData",
  "sellers",
  "messages",
  "marketingData",
  "clientPreferencesData",
  "storePreferencesData",
  "giftRegistryData",
  "ratesAndBenefitsData",
  "openTextField",
  "commercialConditionData",
  "customData"
]

const Popup = () => {
  const [cep, setCep] = useState('');
  const cartModule = useCart();
  const { sendAttachment } = cartModule

  const handleCepChange = (e: Event) => {
    setCep((e.target as HTMLInputElement).value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/sessions/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "public": {
          "postalCode": {
            "value": cep
          },
          "country": {
            "value": "BRA"
          }
        }
      })
    }).then(res => res.json()).then(async () => {
      const address = await getAddressByPostalCode(cep);

      await sendAttachment({attachment: "shippingData", body: {
        clearAddressIfPostalCodeNotFound: false,
        selectedAddresses: [ address ],
        expectedOrderFormSections,
      }});

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  return (
    <div class="cep-popup">
      <h2>Informe o CEP</h2>
      <div> 
        <input
          type="text"
          placeholder="Digite o CEP"
          value={cep}
          onInput={handleCepChange}
        />
        <button onClick={handleSubmit}>Enviar</button> 
      </div>
    </div>
  );
};

export default Popup;
