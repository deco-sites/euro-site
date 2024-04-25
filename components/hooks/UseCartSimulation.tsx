import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useState, useEffect, useCallback } from 'preact/hooks';
import { InstallmentOption } from '../../sdk/useOffer.ts';

type Item = {
    sellingPrice: number
  }
type CartSimulation = {
	paymentData: PaymentData;
  items: Item[]
}

type PaymentData = {
  installmentOptions: InstallmentOption[];
}

export default function useCartSimulation(skuId:string, sellerId: string) {
	const [cartSimulation, setCartSimulation] = useState<CartSimulation>(
		{ items:[],  paymentData: { installmentOptions: [] } }
	);
	const [isCartSimulationLoading, setIsCartSimulationLoading] = useState(true);

	const cartModule = useCart();
  const { cart, simulate } = cartModule;

	const postalCode = cart?.value?.shippingData?.address?.postalCode
	const handleCartSimulation = useCallback(async () => {
		setIsCartSimulationLoading(true)
		try {

			const res = await simulate({
				items: [
					{
							"id": skuId,
							"quantity": 1,
							"seller": sellerId
					}
			]
			})

			setCartSimulation(res); 

		} catch (error) {
			console.error("Erro na simulação do carrinho: \n", error);
		} finally {
			setIsCartSimulationLoading(false)
		}
	}, [sellerId]);

	useEffect(() => {
		if(sellerId){
			handleCartSimulation();
		} else if(!postalCode && !sellerId && cart.value){
			setIsCartSimulationLoading(false)
		}
		return () => {
			setIsCartSimulationLoading(true)
		}
	}, [handleCartSimulation, sellerId, cart.value]);

	return {
		handleCartSimulation,
		cartSimulation,
		isCartSimulationLoading,
	};
}