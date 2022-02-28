const baseUrl = "https://blue-bottle-api-test.herokuapp.com/v1";

export function tokenUrl() {
  return `${baseUrl}/tokens`;
}

export function coffeeShopsUrl(token: string) {
  return `${baseUrl}/coffee_shops?token=${token}`;
}
