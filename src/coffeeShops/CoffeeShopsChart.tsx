import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { CoffeeShop } from "./models";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type CoffeeShopsChartProps = {
  coffeeShops: CoffeeShop[];
};

export default function CoffeeShopsChart({
  coffeeShops,
}: CoffeeShopsChartProps) {
  const options = createOptions();
  const data = createData(coffeeShops);

  return <Scatter options={options} data={data} />;
}

function createOptions() {
  return {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
}

function createData(coffeeShops: CoffeeShop[]) {
  return {
    datasets: [
      {
        label: "Coffee Shops",
        data: coffeeShops.map((coffeeShop) => ({
          x: coffeeShop.x,
          y: coffeeShop.y,
        })),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
}
