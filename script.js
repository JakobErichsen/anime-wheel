let items = [
  { title: "Elfen Lied", rating: 3 },
  { title: "Gurren Lagann", rating: 3.5 },
  { title: "Black Lagoon", rating: 3.5 },
  { title: "Death Parade", rating: 3.5 },
  { title: "Akame Ga Kill", rating: 3.5 },
  { title: "Neon Genesis Evangelion", rating: 4 },
  { title: "Erased", rating: 3.5 },
  { title: "Kaiju No. 8", rating: 4 },
  { title: "Cowboy Bebop", rating: 4.5 },
  { title: "Odd Taxi", rating: 4 },
  { title: "Paprika", rating: 4.5 },
  { title: "86", rating: 3 },
  { title: "Boondocks", rating: 2.5 },
  { title: "Prinzessin Mononoke", rating: 4 },
  { title: "Redline", rating: 3.5 },
  { title: "Overlord", rating: 3 },
  { title: "Parasyte", rating: 4 },
  { title: "Mashle", rating: 4 },
  { title: "Mirai Nikki", rating: 3.5 },
  { title: "Steins;Gate", rating: 4 }
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;

let angle = 0;

function getTotalWeight() {
  return items.reduce((sum, item) => sum + item.rating, 0);
}

function drawWheel() {
  const total = getTotalWeight();
  let startAngle = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach((item, index) => {
    const sliceAngle = (item.rating / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, startAngle + sliceAngle);
    ctx.fillStyle = `hsl(${index * 30}, 70%, 50%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(item.title, radius / 2, 0);
    ctx.restore();

    startAngle += sliceAngle;
  });
}

function updateList() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} (${item.rating})`;
    list.appendChild(li);
  });
}

function spinWheel() {
  if (items.length === 0) return;

  const total = getTotalWeight();
  const rand = Math.random() * total;

  let cumulative = 0;
  let selectedIndex = 0;

  for (let i = 0; i < items.length; i++) {
    cumulative += items[i].rating;
    if (rand <= cumulative) {
      selectedIndex = i;
      break;
    }
  }

  const selected = items[selectedIndex];

  document.getElementById("result").textContent = `🎉 Ergebnis: ${selected.title}`;

  // entfernen
  items.splice(selectedIndex, 1);

  drawWheel();
  updateList();
}

document.getElementById("spinBtn").addEventListener("click", spinWheel);

// initial
drawWheel();
updateList();
