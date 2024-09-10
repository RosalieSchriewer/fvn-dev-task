import "./style.css";
import Chart from "chart.js/auto";

const factBoxListener = () => {
  for (const fact of document.querySelectorAll(".fact")) {
    fact.onclick = () => fact.classList.toggle("expanded");
  }
};

Chart.register({
  id: "textInsidePlugin",
  afterDraw: function (chart) {
    if (chart.config.options.elements.center) {
      const { width, height, ctx } = chart;
      const centerConfig = chart.config.options.elements.center;
      const fontSize = (height / 114).toFixed(2);

      ctx.save();
      ctx.font = fontSize + "em Verdana";
      ctx.textBaseline = "middle";
      ctx.fillStyle = centerConfig.color || "#000";

      const text = centerConfig.text;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.restore();
    }
  },
});

const chartData = [
  { id: "chart1", filled: 20, empty: 80, text: "20%" },
  { id: "chart2", filled: 50, empty: 50, text: "50%" },
  { id: "chart3", filled: 5, empty: 95, text: "5%" },
  {
    id: "chart4",
    segments: [
      { value: 20, color: "#0071BC" },
      { value: 80, color: "#E0E0E0" },
    ],
    text: "20%",
  },
  {
    id: "chart5",
    segments: [
      { value: 60, color: "#0071BC" },
      { value: 20, color: "#84A5BC" },
      { value: 20, color: "#E0E0E0" },
    ],
    text: "60-80%",
  },
  {
    id: "chart6",
    segments: [
      { value: 5, color: "#0071BC" },
      { value: 95, color: "#E0E0E0" },
    ],
    text: "5%",
  },
  {
    id: "chart7",
    segments: [
      { value: 10, color: "#00A99D" },
      { value: 5, color: "#72CFC7" },
      { value: 85, color: "#E0E0E0" },
    ],
    text: "10-15%",
  },
  {
    id: "chart8",
    segments: [
      { value: 5, color: "#00A99D" },
      { value: 95, color: "#E0E0E0" },
    ],
    text: "5%",
  },
];

const chartInstances = {};

const createAndAnimateChart = (id, segments, text) => {
  const ctx = document.getElementById(id).getContext("2d");

  if (chartInstances[id]) {
    chartInstances[id].destroy();
  }

  const data = {
    datasets: [
      {
        data: segments.map((segment) => segment.value),
        backgroundColor: segments.map((segment) => segment.color),
        hoverBackgroundColor: segments.map((segment) => segment.color),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
    elements: {
      center: {
        text: text,
      },
    },
  };

  chartInstances[id] = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: options,
  });
};

const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const canvas = entry.target;
      const id = canvas.id;
      const chartDataItem = chartData.find((chart) => chart.id === id);

      createAndAnimateChart(
        chartDataItem.id,
        chartDataItem.segments || [
          { value: chartDataItem.filled, color: "#FBB03B" },
          { value: chartDataItem.empty, color: "#E0E0E0" },
        ],
        chartDataItem.text
      );

      observer.unobserve(canvas);
    }
  });
};

const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
});

document.querySelectorAll("canvas").forEach((canvas) => {
  observer.observe(canvas);
});

const setupCategoryButtons = () => {
  const buttons = document.querySelectorAll(".button-container button");
  const containers = {
    dysleksi: document.querySelector(".image-container-dysleksi"),
    dyskalkuli: document.querySelector(".image-container-dyskalkuli"),
    DLD: document.querySelector(".image-container-DLD"),
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      Object.keys(containers).forEach((key) => {
        containers[key].style.display = key === target ? "grid" : "none";
      });

      containers[target].querySelectorAll("canvas").forEach((canvas) => {
        observer.observe(canvas);
      });
    });
  });

  if (buttons.length > 0) {
    buttons[0].click();
  }
};

factBoxListener();
setupCategoryButtons();
