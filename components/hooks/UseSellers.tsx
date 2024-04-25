import { useState, useEffect, useCallback } from 'preact/hooks';

export default function useSellers() {
	const [sellerId, setSellerId] = useState("");
	const [regionId, setRegionId] = useState("");

	useEffect(() => {
		async function handleSellerId ()  {
			try {
				const res = await fetch(`/api/sessions?items=checkout.regionId`);
				const data = await res.json();
	
				const regionId = data?.namespaces?.checkout?.regionId?.value
				setRegionId(regionId)
				if(!regionId) return;

				const resSeller = await fetch(`/api/checkout/pub/regions/${regionId}`);
				const dataSeller = await resSeller.json();
				const [firstSeller] = dataSeller

				if(firstSeller){
					setSellerId(firstSeller.sellers[0]?.id)
				}
	
			} catch (error) {
				console.error("Error getting seller ID: \n", error);
			}
		}

		handleSellerId();
	}, []);

	return {
		sellerId,
		regionId,
	};
}