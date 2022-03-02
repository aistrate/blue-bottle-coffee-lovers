import { CoffeeShop } from "./models";
import useCoffeeShopsFetch from "./useCoffeeShopsFetch";

export default App;

function App() {
  const coffeeShopsFetch = useCoffeeShopsFetch();

  return (
    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
      {coffeeShopsFetch.httpStatus &&
        [406, 503].includes(coffeeShopsFetch.httpStatus) && (
          <span
            style={{ color: "red" }}
          >{`HTTP error (${coffeeShopsFetch.httpStatus}). Please come back later.`}</span>
        )}

      {coffeeShopsFetch.data &&
        coffeeShopsFetch.data.map((coffeeShop) => (
          <CoffeeShopInfo key={coffeeShop.id} coffeeShop={coffeeShop} />
        ))}
    </div>
  );
}

function CoffeeShopInfo({ coffeeShop }: { coffeeShop: CoffeeShop }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div>{coffeeShop.name}</div>
      <div>
        Coordinates: {coffeeShop.x}, {coffeeShop.y}
      </div>
    </div>
  );
}
