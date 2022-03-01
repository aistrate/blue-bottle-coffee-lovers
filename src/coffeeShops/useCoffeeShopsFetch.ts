import { coffeeShopsUrl, tokenUrl } from "../api";
import useFetch from "../useFetch";
import { CoffeeShop, Token } from "./models";

export default function useCoffeeShopsFetch() {
  const tokenFetch = useFetch<Token>(tokenUrl(), "POST");
  const token = tokenFetch.data?.token;

  return useFetch<CoffeeShop[]>(token ? coffeeShopsUrl(token) : null);
}
