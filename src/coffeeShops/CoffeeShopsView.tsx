import CoffeeShopsChart from "./CoffeeShopsChart";
import { convertFromRaw } from "./models";
import useCoffeeShopsFetch from "./useCoffeeShopsFetch";

export default function CoffeeShopsView() {
  const coffeeShopsFetch = useCoffeeShopsFetch();
  const coffeeShops = coffeeShopsFetch.data?.map(convertFromRaw);

  return (
    <div className="CoffeeShopsView__container">
      {coffeeShopsFetch.isLoading && <div className="spinner"></div>}

      {coffeeShopsFetch.error && (
        <div className="error">
          {coffeeShopsFetch.httpStatus
            ? `${coffeeShopsFetch.error}. Please come back later.`
            : coffeeShopsFetch.error}
        </div>
      )}

      {coffeeShops && <CoffeeShopsChart coffeeShops={coffeeShops} />}
    </div>
  );
}
