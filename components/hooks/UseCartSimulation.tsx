import { useState, useEffect, useCallback } from 'preact/hooks';
import useSellers from "$store/islands/UseSellers.tsx";

type Item = {
    sellingPrice: number
  }
type CartSimulation = {
  items: Item[]
}

export default function useCartSimulation(skuId:string) {
	const [cartSimulation, setCartSimulation] = useState<CartSimulation>(
		{items:[]}
	);
    const { sellerId } = useSellers();


	const handleCartSimulation = useCallback(async () => {
		try {
			const corpo = {
			    "items": [
			        {
			            "id": skuId,
			            "quantity": 1,
			            "seller": sellerId
			        }
			    ]
			};
			
			const res = await fetch(`/api/checkout/pub/orderForms/simulation?sc=1`, {
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(corpo)
			});
            
			const data = await res.json();

			setCartSimulation(data); 

		} catch (error) {
			console.error("Erro na simulação do carrinho: \n", error);
		}
	}, [sellerId]);

	useEffect(() => {
		if(sellerId){
            handleCartSimulation();
        }

        else{
            console.log("ELSE")
        }
	}, [handleCartSimulation, sellerId]);

	return {
		handleCartSimulation,
		cartSimulation,
        sellerId,
	};
}