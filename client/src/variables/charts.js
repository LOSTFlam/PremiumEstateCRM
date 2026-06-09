export const pieChartData = [
  { name: "Your files", value: 63 },
  { name: "System", value: 25 },
  { name: "Other", value: 12 },
];

export const pieChartOptions = {
  chart: {
    type: "pie",
    width: 300,
  },
  labels: ["Your files", "System", "Other"],
  colors: ["#4318FF", "#6AD2FF", "#ECC94B"],
  legend: {
    show: true,
    position: "bottom",
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1) + "%";
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "0%",
      },
    },
  },
};
