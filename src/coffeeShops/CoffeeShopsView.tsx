import CoffeeShopsChart from "./CoffeeShopsChart";
import { convertFromRaw } from "./models";
import useCoffeeShopsFetch from "./useCoffeeShopsFetch";

export default function CoffeeShopsView() {
  const coffeeShopsFetch = useCoffeeShopsFetch();
  const coffeeShops = coffeeShopsFetch.data?.map(convertFromRaw);

  return (
    <div style={{ margin: "20px 6vw 0 6vw" }}>
      {coffeeShopsFetch.isLoading && <div>Loading...</div>}

      {coffeeShopsFetch.error && (
        <div style={{ color: "red" }}>
          {coffeeShopsFetch.httpStatus
            ? `${coffeeShopsFetch.error}. Please come back later.`
            : coffeeShopsFetch.error}
        </div>
      )}

      {coffeeShops && <CoffeeShopsChart coffeeShops={coffeeShops} />}
    </div>
  );
}
