import {
  AggregateOffer,
  UnitPriceSpecification,
} from "apps/commerce/types.ts";

type SellerMerchantInstallment = {
  id: string,
  count: number,
  hasInterestRate: boolean,
  interestRate: number,
  value: number,
  total?: number
}

type Installment = {
  count: number,
  hasInterestRate: boolean,
  interestRate: number,
  value: number,
  total: number,
  sellerMerchantInstallments?: SellerMerchantInstallment[]
}

export type InstallmentOption = {
  paymentSystem?: string;
  bin?: null;
  paymentName?: string;
  paymentGroupName?: string;
  value: number;
  installments: Installment[];
}

const bestInstallment = (
  acc: UnitPriceSpecification | null,
  curr: UnitPriceSpecification,
) => {
  if (curr.priceComponentType !== "https://schema.org/Installment") {
    return acc;
  }

  if (!acc) {
    return curr;
  }

  if (acc.price > curr.price) {
    return curr;
  }

  if (acc.price < curr.price) {
    return acc;
  }

  if (
    acc.billingDuration && curr.billingDuration &&
    acc.billingDuration < curr.billingDuration
  ) {
    return curr;
  }

  return acc;
};

const installmentToString = (
  installment: UnitPriceSpecification,
) => {
  const { billingDuration, billingIncrement } = installment;

  if (!billingDuration || !billingIncrement) {
    return "";
  }

  return `${billingDuration}x de R$ ${billingIncrement}`;
};

function sortInstallmentsByQuantityAndInterest(installmentOption: Installment[]) {
  const tempArray = installmentOption ? [...installmentOption] : []
  return tempArray.sort((installmentA, installmentB) => {
      if((installmentA.count < installmentB.count) || (installmentA.total > installmentB.total)) return -1
      if((installmentA.count > installmentB.count) || (installmentA.total < installmentB.total)) return 1
      return 0
  })
}

function getBetterInstallment(installmentOptions: InstallmentOption[] | undefined){
  const betterInstallmentOptionForEachPaymentMethod = installmentOptions?.map(installmentOption => {
      const installmentOptionSorted = sortInstallmentsByQuantityAndInterest(installmentOption.installments)
      return {...installmentOption, ...installmentOptionSorted?.pop()}
  }).filter(installmentOption => installmentOption !== undefined)
  
  const sortedInstallmentOption = sortInstallmentsByQuantityAndInterest(betterInstallmentOptionForEachPaymentMethod as Installment[])
  
  const betterInstallmentOption = sortedInstallmentOption?.pop()
  
  return betterInstallmentOption
}

export const useOffer = (aggregateOffer?: AggregateOffer, customInstallmentOptions?: InstallmentOption[]) => {
  const offer = aggregateOffer?.offers[0];
  const listPrice = offer?.priceSpecification.find((spec) =>
    spec.priceType === "https://schema.org/ListPrice"
  );

  const installment = offer?.priceSpecification.reduce(bestInstallment, null);
  const customInstallment = getBetterInstallment(customInstallmentOptions);
  const seller = offer?.seller;
  const price = offer?.price;
  const availability = offer?.availability;

  if(customInstallment) {
    installment.billingDuration = customInstallment.count
    installment.billingIncrement = customInstallment.value / 100
  }

  return {
    price,
    listPrice: listPrice?.price,
    availability,
    seller,
    installments: installment && price
      ? installmentToString(installment)
      : null,
    installment,
    customInstallment,
    offer,
  };
};
