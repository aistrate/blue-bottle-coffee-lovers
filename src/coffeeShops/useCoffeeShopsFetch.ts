import { useEffect, useState } from "react";
import { coffeeShopsUrl, tokenUrl } from "../api";
import fetchData, { FetchResult } from "../fetchData";
import { CoffeeShop, Token } from "./models";

const retryCount = 3;
const retryInterval = 1000;

export default function useCoffeeShopsFetch() {
  const [fetchResult, setFetchResult] = useState<FetchResult<CoffeeShop[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setFetchResult(await fetchCoffeeShopsWithRetry(retryCount));
      setIsLoading(false);
    })();
  }, []);

  return { ...fetchResult, isLoading };
}

async function fetchCoffeeShopsWithRetry(
  retries: number,
  prevToken?: string
): Promise<FetchResult<CoffeeShop[]>> {
  const fetchResult = await fetchCoffeeShops(prevToken);

  retries = retries - 1;

  if (
    fetchResult.httpStatus === 200 ||
    !fetchResult.httpStatus ||
    retries <= 0
  ) {
    return fetchResult;
  }

  await delay(retryInterval);

  return await fetchCoffeeShopsWithRetry(retries, fetchResult.token);
}

type CoffeeShopsFetchResult = { token?: string } & FetchResult<CoffeeShop[]>;

async function fetchCoffeeShops(
  prevToken?: string
): Promise<CoffeeShopsFetchResult> {
  let token: string;

  if (!prevToken) {
    const tokenFetchResult = await fetchData<Token>(tokenUrl(), "POST");

    if (tokenFetchResult.error) {
      return {
        error: `Token fetch error: ${tokenFetchResult.error}`,
        httpStatus: tokenFetchResult.httpStatus,
      };
    }

    token = tokenFetchResult.data?.token as string;
  } else {
    token = prevToken;
  }

  const coffeeShopsFetchResult = await fetchData<CoffeeShop[]>(
    coffeeShopsUrl(token)
  );

  return {
    token: coffeeShopsFetchResult.httpStatus === 401 ? undefined : token,
    ...coffeeShopsFetchResult,
  };
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
