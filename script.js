const mapContainer = document.getElementById("map-container");
const worldMap = document.getElementById("world-map");
let scale = 1;

mapContainer.addEventListener("wheel", function (event) {
  scale += event.deltaY * -0.01;

  scale = Math.min(Math.max(scale, 1));

  worldMap.style.transform = `scale(${scale})`;

  event.preventDefault();
});

function zoomIn() {
  scale += 0.1;
  applyTransform();
}

function zoomOut() {
  scale -= 0.1;
  applyTransform();
}

function applyTransform() {
  scale = Math.min(Math.max(scale, 0.1), 3);
  worldMap.style.transform = `scale(${scale})`;
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("barGraphCanvas");
  const overlayCanvas = document.getElementById("overlayCanvas");
  const ctx = canvas.getContext("2d");
  const overlayCtx = overlayCanvas.getContext("2d");

  const data = [
    80, 60, 90, 75, 40, 85, 50, 70, 10, 45, 65, 75, 80, 87, 34, 55, 65, 7, 77,
    88, 44, 34, 56, 51,
  ];
  const barWidth = 10;
  const barSpacing = 3; // Reduced gap
  const maxDataValue = Math.max(...data);

  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxDataValue) * (canvas.height - 50);
    const x = (index + 1) * (barWidth + barSpacing);
    const y = canvas.height - barHeight - 30;

    ctx.fillStyle = "#ff0000"; // Red color
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw x-axis labels
    ctx.fillStyle = "#000";
    ctx.fillText(`${index + 1}`, x + barWidth / 2, canvas.height - 10);

    // Draw y-axis labels
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
  });

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(barWidth / 2, canvas.height - 30);
  ctx.lineTo(
    (data.length + 1) * (barWidth + barSpacing) - barSpacing + barWidth / 2,
    canvas.height - 30
  );
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Draw y-axis with the label "No. of Attacks"
  ctx.beginPath();
  ctx.moveTo(barWidth / 2, 0);
  ctx.lineTo(barWidth / 2, canvas.height - 30);
  ctx.strokeStyle = "#000";
  ctx.stroke();
  ctx.fillStyle = "#000";

  // Hover effect
  overlayCanvas.addEventListener("mousemove", handleMouseMove);
  overlayCanvas.addEventListener("mouseout", handleMouseOut);

  function handleMouseMove(event) {
    const rect = overlayCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    data.forEach((value, index) => {
      const x = (index + 1) * (barWidth + barSpacing);
      const y =
        canvas.height - (value / maxDataValue) * (canvas.height - 50) - 30;

      if (
        mouseX > x &&
        mouseX < x + barWidth &&
        mouseY > y &&
        mouseY < canvas.height - 30
      ) {
        overlayCtx.fillStyle = "#3498db"; // Highlight color
        overlayCtx.fillRect(
          x,
          y,
          barWidth,
          (value / maxDataValue) * (canvas.height - 50)
        );
        overlayCtx.fillStyle = "#000";
        overlayCtx.fillText(`Value: ${value}`, x + barWidth / 2, y - 15);
      }
    });
  }

  function handleMouseOut() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("lineGraphCanvas");
  const ctx = canvas.getContext("2d");

  const data = [
    80, 60, 90, 75, 40, 85, 50, 70, 10, 45, 65, 75, 80, 87, 34, 55, 65, 7, 77,
    88, 44, 34, 56, 51,
  ];
  const maxValue = Math.max(...data);
  const dataPoints = data.length;

  const barWidth = canvas.width / (dataPoints - 1); // Adjusted for better spacing
  const scalingFactor = canvas.height / maxValue;

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - data[0] * scalingFactor);
  ctx.lineWidth = 3;

  for (let i = 0; i < dataPoints; i++) {
    const x = i * barWidth;
    const y = canvas.height - data[i] * scalingFactor;

    // Connect points with lines
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#3498db"; // Dark blue color for the line
  ctx.stroke();

  // Draw the shaded area below the line
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = "rgba(52, 152, 219, 0.3)"; // Light blue shade
  ctx.fill();
});
