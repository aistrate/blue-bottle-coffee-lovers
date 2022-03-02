import { CoffeeShop } from "./models";

export default function CoffeeShopView({
  coffeeShop,
}: {
  coffeeShop: CoffeeShop;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div>{coffeeShop.name}</div>
      <div>
        Coordinates: {coffeeShop.x}, {coffeeShop.y}
      </div>
    </div>
  );
}
