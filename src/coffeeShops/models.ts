export type Token = {
  token: string;
};

export type CoffeeShop = {
  id: number;
  name: string;
  x: number;
  y: number;
};

export type CoffeeShopRaw = {
  id: number;
  name: string;
  x: string;
  y: string;
};

export function convertFromRaw(coffeeShopRaw: CoffeeShopRaw): CoffeeShop {
  return {
    id: coffeeShopRaw.id,
    name: coffeeShopRaw.name,
    // switch x and y
    x: parseFloat(coffeeShopRaw.y),
    y: parseFloat(coffeeShopRaw.x),
  };
}
