import { useEffect, useState } from "react";
import { coffeeShopsUrl, tokenUrl } from "../api";
import fetchData, { FetchResult } from "../fetchData";
import { CoffeeShop, Token } from "./models";

const retryCount = 3;
const retryInterval = 1000;
const fetchTimeout = 2000;

type CoffeeShopsFetchResult = { token?: string } & FetchResult<CoffeeShop[]>;

export default function useCoffeeShopsFetch() {
  const [fetchResult, setFetchResult] = useState<CoffeeShopsFetchResult>({});
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
): Promise<CoffeeShopsFetchResult> {
  const fetchResult = await fetchCoffeeShops(prevToken);

  retries = retries - 1;

  if (
    fetchResult.httpStatus === 200 ||
    (!fetchResult.httpStatus && !fetchResult.timedOut) ||
    retries <= 0
  ) {
    return fetchResult;
  }

  if (fetchResult.httpStatus !== 401 && !fetchResult.timedOut) {
    await delay(retryInterval);
  }

  return await fetchCoffeeShopsWithRetry(retries, fetchResult.token);
}

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
    coffeeShopsUrl(token),
    "GET",
    fetchTimeout
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
