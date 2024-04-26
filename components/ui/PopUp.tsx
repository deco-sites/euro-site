import { useState } from 'preact/hooks';
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useSignal } from "@preact/signals";
import Loading from "$store/components/ui/Loading.tsx";
import { formatPostalCode } from '../../utils/address.ts';

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

type PopUpProps = {
  savedPostalCode: string;
}

const Popup = ({ savedPostalCode }: PopUpProps) => {
  const loading = useSignal(false);
  const cartModule = useCart();
  const { sendAttachment } = cartModule;
  
  const postalCode = useSignal(formatPostalCode(savedPostalCode) ?? "");

  const handlePostalCodeChange = (e: any) => {
    let { value } = e.currentTarget;
    value = formatPostalCode(value);
    loading.value = false;
    postalCode.value = value;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    loading.value = true;

    if(postalCode.value.length < 9) {
      loading.value = false;
      return 
    }

    fetch("/api/sessions/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "public": {
          "postalCode": {
            "value": postalCode.value
          },
          "country": {
            "value": "BRA"
          }
        }
      })
    }).then(res => res.json()).then(async () => {
      const address = await getAddressByPostalCode(postalCode.value);

      await sendAttachment({attachment: "shippingData", body: {
        clearAddressIfPostalCodeNotFound: false,
        selectedAddresses: [ address ],
        expectedOrderFormSections,
      }});

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).finally(() => loading.value = false);
  };

  return (
    <div className="postal-code-popup flex flex-col gap-2">
      <label htmlFor="postalCode">Informe seu CEP</label>
      <div className="flex justify-between gap-8">
        <input
          id="postalCode"
          name="postalCode"
          type="text"
          placeholder="00000-000"
          maxLength={9}
          value={postalCode.value}
          onChange={handlePostalCodeChange}
          className="outline-none w-full rounded-full border-2 px-2"
        />
        <button className="btn-primary py-2 px-4 rounded-lg h-10" onClick={handleSubmit} disabled={loading.value}>
          {loading.value ? <Loading /> : "Enviar"}
        </button> 
      </div>
    </div>
  );
};

export default Popup;
