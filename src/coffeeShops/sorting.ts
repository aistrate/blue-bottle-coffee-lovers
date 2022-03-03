type Point = { x: number; y: number };

export function sortByDistance<P extends Point>(basePoint: Point, points: P[]) {
  const pointsWithDistance = points.map((point) => ({
    distance: calculateDistance(basePoint, point),
    point,
  }));

  pointsWithDistance.sort((a, b) => a.distance - b.distance);

  return pointsWithDistance.map((p) => p.point);
}

function calculateDistance(a: Point, b: Point) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
