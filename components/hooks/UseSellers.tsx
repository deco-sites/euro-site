import { useState, useEffect, useCallback } from 'preact/hooks';

export default function useSellers() {
	const [sellerId, setSellerId] = useState(
		""
	);

	const handleSellerId = useCallback(async () => {
		try {
			const res = await fetch(`/api/sessions?items=checkout.regionId`);
			const data = await res.json();

			const regionId = data?.namespaces?.checkout?.regionId?.value
			if(!regionId) return;

			const resSeller = await fetch(`/api/checkout/pub/regions/${regionId}`);
			const dataSeller = await resSeller.json();

			if(dataSeller && dataSeller[0]){
				setSellerId(dataSeller[0]?.sellers[0]?.id)
			}

		} catch (error) {
			console.error("Error getting seller ID: \n", error);
		} finally {
			// 
		}
	}, []);

	useEffect(() => {
		
		handleSellerId();
	}, [handleSellerId]);

	return {
		handleSellerId,
		sellerId,
	};
}