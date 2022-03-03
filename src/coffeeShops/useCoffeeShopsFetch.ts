import { useEffect, useState } from "react";
import { coffeeShopsUrl, tokenUrl } from "../api";
import fetchData, { FetchResult } from "../fetchData";
import { CoffeeShopRaw, Token } from "./models";

const retryCount = 3;
const retryInterval = 1000;
const fetchTimeout = 2000;

const httpStatusCode = {
  ok: 200,
  unauthorized: 401,
} as const;

type CoffeeShopsFetchResult = { token?: string } & FetchResult<CoffeeShopRaw[]>;

export default function useCoffeeShopsFetch() {
  const [fetchResult, setFetchResult] = useState<CoffeeShopsFetchResult>({});
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAndSetState() {
    const fetchResult = await fetchCoffeeShopsWithRetry(retryCount);
    setFetchResult(fetchResult);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchAndSetState();
  }, []);

  return { ...fetchResult, isLoading };
}

async function fetchCoffeeShopsWithRetry(
  retries: number,
  prevToken?: string
): Promise<CoffeeShopsFetchResult> {
  const fetchResult = await fetchCoffeeShops(prevToken);

  retries = retries - 1;

  const isHttpError =
    !!fetchResult.httpStatus && fetchResult.httpStatus !== httpStatusCode.ok;
  const shouldRetry = retries >= 1 && (isHttpError || fetchResult.timedOut);

  if (!shouldRetry) {
    return fetchResult;
  }

  if (
    fetchResult.httpStatus !== httpStatusCode.unauthorized &&
    !fetchResult.timedOut
  ) {
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

  const coffeeShopsFetchResult = await fetchData<CoffeeShopRaw[]>(
    coffeeShopsUrl(token),
    "GET",
    fetchTimeout
  );

  return {
    token:
      coffeeShopsFetchResult.httpStatus === httpStatusCode.unauthorized
        ? undefined
        : token,
    ...coffeeShopsFetchResult,
  };
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
