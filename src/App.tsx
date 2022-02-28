import { coffeeShopsUrl, tokenUrl } from "./api";
import { CoffeeShop, Token } from "./models";
import useFetch from "./useFetch";

export default App;

function App() {
  const coffeeShops = useCoffeeShops();

  return (
    <div>
      {coffeeShops &&
        coffeeShops.map((coffeeShop) => (
          <CoffeeShopInfo key={coffeeShop.id} coffeeShop={coffeeShop} />
        ))}
    </div>
  );
}

function CoffeeShopInfo({ coffeeShop }: { coffeeShop: CoffeeShop }) {
  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      <div>{coffeeShop.name}</div>
      <div>
        Coordinates: {coffeeShop.x}, {coffeeShop.y}
      </div>
    </div>
  );
}

function useCoffeeShops() {
  const tokenFetch = useFetch<Token>(tokenUrl(), "POST");
  const token = tokenFetch.data?.token;

  const coffeShopsFetch = useFetch<CoffeeShop[]>(
    token ? coffeeShopsUrl(token) : null
  );

  return coffeShopsFetch.data;
}
