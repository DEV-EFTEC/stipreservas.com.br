import { useEffect, useState } from "react";
import { useBookingPrice, calculateTotalPrice } from "@/hooks/useBookingPrice";
import { apiRequest } from "@/lib/api";

export function useBookingPriceWithDefault(draw) {
  const [price, setPrice] = useState();

  useEffect(() => {
    async function computePrice() {
      if (!draw) return;

      setPrice(calculateTotalPrice(draw));
    }

    computePrice();
  }, [draw]);

  return price;
}
