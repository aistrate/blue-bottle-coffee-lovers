import { useEffect, useState } from "react";
import { coffeeShopsUrl, tokenUrl } from "../api";
import fetchData from "../fetchData";
import { CoffeeShop, Token } from "./models";

export default function useCoffeeShopsFetch() {
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[] | undefined>();
  const [httpStatus, setHttpStatus] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokenFetch = await fetchData<Token>(tokenUrl(), "POST");

      if (tokenFetch.error) {
        setError(`Token fetch error: ${tokenFetch.error}`);
        setIsLoading(false);
        return;
      }

      const token = tokenFetch.data?.token as string;

      const coffeeShopsFetch = await fetchData<CoffeeShop[]>(
        coffeeShopsUrl(token)
      );

      setCoffeeShops(coffeeShopsFetch.data);
      setHttpStatus(coffeeShopsFetch.httpStatus);
      setError(coffeeShopsFetch.error);
      setIsLoading(false);
    })();
  }, []);

  return { coffeeShops, httpStatus, error, isLoading };
}
