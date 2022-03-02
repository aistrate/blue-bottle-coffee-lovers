import CoffeeShopView from "./CoffeeShopView";
import { convertFromRaw } from "./models";
import useCoffeeShopsFetch from "./useCoffeeShopsFetch";

export default function CoffeeShopsView() {
  const coffeeShopsFetch = useCoffeeShopsFetch();
  const coffeeShops = coffeeShopsFetch.data?.map(convertFromRaw);

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      {coffeeShopsFetch.isLoading && <div>Loading...</div>}

      {coffeeShopsFetch.error && (
        <div style={{ color: "red" }}>
          {coffeeShopsFetch.httpStatus
            ? `${coffeeShopsFetch.error}. Please come back later.`
            : coffeeShopsFetch.error}
        </div>
      )}

      {coffeeShops &&
        coffeeShops.map((coffeeShop) => (
          <CoffeeShopView key={coffeeShop.id} coffeeShop={coffeeShop} />
        ))}
    </div>
  );
}
