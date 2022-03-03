import { sortByDistance } from "./sorting";

test("sort by distance to point between Seattle and San Francisco", () => {
  const sorted = sortByDistance({ x: -122, y: 45 }, locations);

  expect(getNames(sorted)).toEqual([
    "Seattle",
    "Seattle 2",
    "San Francisco",
    "Rio de Janeiro",
    "Moscow",
    "Sydney",
  ]);
});

test("sort by distance to point in Romania", () => {
  const sorted = sortByDistance({ x: 24, y: 46 }, locations);

  expect(getNames(sorted)).toEqual([
    "Moscow",
    "Rio de Janeiro",
    "Seattle",
    "Seattle 2",
    "San Francisco",
    "Sydney",
  ]);
});

test("sort empty array", () => {
  const sorted = sortByDistance({ x: 24, y: 46 }, []);

  expect(getNames(sorted)).toEqual([]);
});

function getNames(locations: Location[]) {
  return locations.map((location) => location.name);
}

type Location = { id: number; name: string; x: number; y: number };

const locations: Location[] = [
  {
    id: 1,
    name: "Seattle",
    x: -122.316,
    y: 47.581,
  },
  {
    id: 2,
    name: "San Francisco",
    x: -122.334,
    y: 37.521,
  },
  {
    id: 3,
    name: "Moscow",
    x: 37.595,
    y: 55.752,
  },
  {
    id: 4,
    name: "Seattle 2",
    x: -122.337,
    y: 47.587,
  },
  {
    id: 5,
    name: "Rio de Janeiro",
    x: -43.234,
    y: -22.923,
  },
  {
    id: 6,
    name: "Sydney",
    x: 151.207,
    y: -33.872,
  },
];
