import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ todos }) => {
  const completed = todos.filter((t) => t.completed).length;
  const urgent = todos.filter((t) => t.priority === "URGENT").length;
  const important = todos.filter((t) => t.priority === "IMPORTANT").length;
  const canWait = todos.filter((t) => t.priority === "CAN_WAIT").length;

  const data = {
    labels: ["Completed", "Urgent", "Important", "Can Wait"],
    datasets: [
      {
        label: "# of Tasks",
        data: [completed, urgent, important, canWait],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(144, 238, 144, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h4 className="text-center mb-3">Tasks Overview</h4>
      <Pie data={data} />
    </>
  );
};

export default Dashboard;
