import { useEffect, useState } from "react";
import { coffeeShopsUrl, tokenUrl } from "../api";
import fetchData, { FetchResult } from "../fetchData";
import { CoffeeShop, Token } from "./models";

const retryDelay = 1000;

export default function useCoffeeShopsFetch() {
  const [fetchResult, setFetchResult] = useState<FetchResult<CoffeeShop[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setFetchResult(await fetchCoffeeShopsWithRetry(3));
      setIsLoading(false);
    })();
  }, []);

  return { ...fetchResult, isLoading };
}

async function fetchCoffeeShopsWithRetry(
  retries: number
): Promise<FetchResult<CoffeeShop[]>> {
  const fetchResult = await fetchCoffeeShops();

  retries = retries - 1;

  if (fetchResult.httpStatus === 200 || retries <= 0) {
    return fetchResult;
  }

  await delay(retryDelay);

  return await fetchCoffeeShopsWithRetry(retries);
}

async function fetchCoffeeShops(): Promise<FetchResult<CoffeeShop[]>> {
  const tokenFetchResult = await fetchData<Token>(tokenUrl(), "POST");

  if (tokenFetchResult.error) {
    return {
      error: `Token fetch error: ${tokenFetchResult.error}`,
      httpStatus: tokenFetchResult.httpStatus,
    };
  }

  const token = tokenFetchResult.data?.token as string;

  return await fetchData<CoffeeShop[]>(coffeeShopsUrl(token));
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
