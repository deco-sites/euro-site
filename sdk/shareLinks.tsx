import type { ShareableNetwork } from "$store/components/product/ProductDetails.tsx";

export const getShareLink = (
  { network, productName, url }: {
    network: ShareableNetwork;
    productName: string;
    url: string;
  },
) => {
  switch (network) {
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "Twitter":
      return `https://twitter.com/intent/tweet?text=${productName}&url=${url}`;
    case "Email":
      return `mailto:?subject=${productName}&body=${url}`;
    case "WhatsApp":
      return `https://wa.me/?text=${productName}%20${url}`;
  }
};
