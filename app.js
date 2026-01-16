const bg = document.getElementById("bg");
const draw = document.getElementById("draw");

const bgCtx = bg.getContext("2d");
const drawCtx = draw.getContext("2d");

const color = document.getElementById("color");
const size = document.getElementById("size");
const clearBtn = document.getElementById("clear");
const penBtn = document.getElementById("pen");
const eraserBtn = document.getElementById("eraser");

let mode = "pen"; // "pen" or "eraser"
const KEY = "drawing-layer";

penBtn.onclick = () => {
  mode = "pen";
  penBtn.classList.add("active");
  eraserBtn.classList.remove("active");
};

eraserBtn.onclick = () => {
  mode = "eraser";
  eraserBtn.classList.add("active");
  penBtn.classList.remove("active");
};

function resize() {
  const saved = draw.toDataURL();

  bg.width = draw.width = window.innerWidth;
  bg.height = draw.height = window.innerHeight - 50;

  drawBackground();
  restore(saved);
}

function drawBackground() {
  const img = new Image();

  const x = 300;
  const y = 200;

  img.onload = () => {
    bgCtx.clearRect(0, 0, bg.width, bg.height);
    bgCtx.drawImage(img, 0, 0, this.width, this.height);
  };
  img.src = "placeholder.png"; // make sure this file exists
}

function restore(data) {
  if (!data) return;
  const img = new Image();
  img.onload = () => drawCtx.drawImage(img, 0, 0);
  img.src = data;
}

window.addEventListener("resize", resize);
resize();

let drawing = false;
let lastX = 0, lastY = 0;

function start(x, y) {
  drawing = true;
  lastX = x;
  lastY = y;
}

function drawLine(x, y) {
  if (!drawing) return;

  if (mode === "pen") {
    drawCtx.globalCompositeOperation = "source-over";
    drawCtx.strokeStyle = color.value;
  } else {
    drawCtx.globalCompositeOperation = "destination-out";
  }

  drawCtx.lineWidth = size.value;
  drawCtx.lineCap = "round";

  drawCtx.beginPath();
  drawCtx.moveTo(lastX, lastY);
  drawCtx.lineTo(x, y);
  drawCtx.stroke();

  lastX = x;
  lastY = y;
}

function stop() {
  if (!drawing) return;
  drawing = false;
  save();
}

draw.addEventListener("mousedown", e => start(e.offsetX, e.offsetY));
draw.addEventListener("mousemove", e => drawLine(e.offsetX, e.offsetY));
draw.addEventListener("mouseup", stop);
draw.addEventListener("mouseleave", stop);

// Touch support
draw.addEventListener("touchstart", e => {
  const t = e.touches[0];
  const rect = draw.getBoundingClientRect();
  start(t.clientX - rect.left, t.clientY - rect.top);
});

draw.addEventListener("touchmove", e => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = draw.getBoundingClientRect();
  drawLine(t.clientX - rect.left, t.clientY - rect.top);
}, { passive: false });

draw.addEventListener("touchend", stop);

clearBtn.onclick = () => {
  drawCtx.clearRect(0, 0, draw.width, draw.height);
  save();
};

function save() {
  try {
    localStorage.setItem(KEY, draw.toDataURL());
  } catch (e) {
    console.warn("Could not save drawing", e);
  }
}

function load() {
  const data = localStorage.getItem(KEY);
  if (data) restore(data);
}

load();
