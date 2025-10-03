import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        color: "#fff",
        stepSize: 20,
        padding: 10,
      },
      border: { dash: [4, 4] },
      grid: {
        color: "#888",
        tickBorderDash: false,
      },
    },
    x: {
      ticks: {
        color: "#fff",
        padding: 10,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        color: "#ffffff",
      },
    },
  },
};

const labels = [
  "2025-09-09",
  "2025-09-10",
  "2025-09-11",
  "2025-09-12",
  "2025-09-13",
  "2025-09-14",
  "2025-09-15",
  "2025-09-16",
  "2025-09-17",
  "2025-09-18",
];

const UpTimeGraph = () => {
  const [graphData, setGraphData] = useState({ labels: [], data: [] });
  const url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const getUptimeOverTime = async () => {
      try {
        const response = await axios.get(
          `${url}/api/stats/uptimeovertimegraph`
        );
        const dateData = response.data.map((item) => item.date);
        const uptimePercentageData = response.data.map((item) =>
          Math.round(item.uptimePercentage)
        );
        setGraphData({ labels: dateData, data: uptimePercentageData });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    getUptimeOverTime();
  }, []);

  const data = {
    labels: graphData.labels,
    datasets: [
      {
        fill: true,
        label: "Uptime %",
        data: graphData.data,
        backgroundColor: "rgba(53, 162, 255, 0.5)",
        borderColor: "rgb(53, 162, 255)",
      },
    ],
  };
  return <Line options={options} data={data} />;
};

export default UpTimeGraph;
