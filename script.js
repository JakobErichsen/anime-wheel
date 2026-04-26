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

let currentRotation = 0;
let spinning = false;
let lastTickIndex = 0;

// 🔊 einfacher Tick-Sound (ohne Datei, WebAudio)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = 800;
  gain.gain.value = 0.05;

  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function getTotalWeight() {
  return items.reduce((sum, item) => sum + item.rating, 0);
}

function drawWheel(rotation = 0) {
  const total = getTotalWeight();
  let startAngle = rotation;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach((item, index) => {
    const sliceAngle = (item.rating / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, startAngle + sliceAngle);
    ctx.fillStyle = `hsl(${index * 25}, 70%, 50%)`;
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
  if (spinning || items.length === 0) return;

  spinning = true;

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

  // Winkel bis zum Zielsegment
  let startAngle = 0;
  for (let i = 0; i < selectedIndex; i++) {
    startAngle += (items[i].rating / total) * 2 * Math.PI;
  }

  const sliceAngle = (items[selectedIndex].rating / total) * 2 * Math.PI;
  const targetAngle = startAngle + sliceAngle / 2;

  // 🎡 viele Umdrehungen + Ziel
  const spins = 6 + Math.random() * 3;

  const finalRotation =
    (Math.PI * 1.5 - targetAngle) + (Math.PI * 2 * spins);

  animateSpin(currentRotation, currentRotation + finalRotation, selectedIndex);
}

function animateSpin(start, end, selectedIndex) {
  const duration = 4000 + Math.random() * 1000;
  const startTime = performance.now();

  const totalSlices = items.length;

  function animate(time) {
    const t = (time - startTime) / duration;

    if (t >= 1) {
      currentRotation = end % (Math.PI * 2);
      drawWheel(currentRotation);

      const selected = items[selectedIndex];
      document.getElementById("result").textContent =
        `🎉 Ergebnis: ${selected.title}`;

      items.splice(selectedIndex, 1);
      updateList();

      spinning = false;
      return;
    }

    // 🧠 physikalisches Abbremsen (easeOutCubic)
    const ease = 1 - Math.pow(1 - t, 3);
    const angle = start + (end - start) * ease;

    // 🔊 Tick bei Segmentwechsel
    const normalized = angle % (Math.PI * 2);
    const sliceIndex = Math.floor(
      (normalized / (Math.PI * 2)) * totalSlices
    );

    if (sliceIndex !== lastTickIndex) {
      playTick();
      lastTickIndex = sliceIndex;
    }

    drawWheel(angle);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

document.getElementById("spinBtn").addEventListener("click", () => {
  // wichtig für Browser (Audio erst nach Interaction)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  spinWheel();
});

// init
drawWheel();
updateList();
