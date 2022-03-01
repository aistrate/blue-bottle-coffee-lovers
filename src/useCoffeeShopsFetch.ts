import { coffeeShopsUrl, tokenUrl } from "./api";
import { CoffeeShop, Token } from "./models";
import useFetch from "./useFetch";

export default function useCoffeeShopsFetch() {
  const tokenFetch = useFetch<Token>(tokenUrl(), "POST");
  const token = tokenFetch.data?.token;

  return useFetch<CoffeeShop[]>(token ? coffeeShopsUrl(token) : null);
}
