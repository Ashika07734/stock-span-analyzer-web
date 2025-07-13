let prices = [100, 80, 60, 70, 60, 75, 85];
const priceInput = document.getElementById('priceInput');
const priceList = document.getElementById('priceList');
const addBtn = document.getElementById('addBtn');
const calcBtn = document.getElementById('calcBtn');
const resetBtn = document.getElementById('resetBtn');
let myChart = null;

// Show message
function showToast(message, bg = "bg-red-600") {
  const toast = document.getElementById("toast");
  toast.className = `fixed bottom-5 right-5 ${bg} text-white px-4 py-2 rounded shadow z-50`;
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// Update price list
function updatePriceList() {
  priceList.textContent = prices.join(', ');
}

// Add price
addBtn.addEventListener("click", () => {
  const val = parseFloat(priceInput.value);
  if (!isNaN(val) && val > 0) {
    prices.push(val);
    updatePriceList();
    priceInput.value = "";
    showToast("✅ Price added!", "bg-green-600");
  } else {
    showToast("❌ Enter a valid price.", "bg-red-600");
  }
});

// Reset
resetBtn.addEventListener("click", () => {
  prices = [100, 80, 60, 70, 60, 75, 85];
  updatePriceList();
  renderStack([]);
  if (myChart) myChart.destroy();
  showToast("🔄 Reset successful!", "bg-blue-600");
});

// Analyze
calcBtn.addEventListener("click", () => {
  const spans = calculateSpan(prices);
  renderChart(prices, spans);
  renderStack(spans);
  showToast("✅ Analysis completed!", "bg-green-600");
});

// Span calculation using stack
function calculateSpan(prices) {
  const spans = [];
  const stack = [];

  for (let i = 0; i < prices.length; i++) {
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      stack.pop();
    }
    const span = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    spans.push(span);
    stack.push(i);
  }

  return spans;
}

// Render chart
function renderChart(prices, spans) {
  const ctx = document.getElementById("chart").getContext("2d");
  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: prices.map((_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: "Price",
          data: prices,
          backgroundColor: "rgb(81,9,1)",
          borderColor: "rgba(17, 3, 3, 1)",
          borderWidth: 1,
        },
        {
          label: "Span",
          data: spans,
          backgroundColor: "rgb(217,2,3)",
          borderColor: "rgba(121, 27, 3, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Stock Span Analysis" },
      },
    },
  });
}

// Render stack vertically with animation and red shades
function renderStack(spans) {
  const container = document.getElementById("stackView");
  container.innerHTML = "";

  spans.forEach((span, i) => {
    const box = document.createElement("div");
    box.className = "rounded px-4 py-2 font-bold text-sm w-full transform transition-all duration-300 hover:scale-105 shadow fade-in";
    box.style.backgroundColor = `hsl(345, 90%, ${12 + i * 5}%)`; // Red hues
    box.style.animationDelay = `${i * 0.1}s`;
    box.textContent = `Day ${i + 1}: ${span}`;
    container.appendChild(box);
  });
}

// CSV Download
function downloadCSV() {
  const headers = "Day,Price,Span\n";
  const chartData = myChart?.data;
  if (!chartData) return;

  const rows = prices.map((p, i) =>
    `${i + 1},${p},${chartData.datasets[1].data[i]}`).join("\n");

  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stock_span_results.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Initial setup
updatePriceList();
