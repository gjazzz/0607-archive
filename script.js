/* ================================
   CONFIG
================================ */
const STORE = document.getElementById("store");
const HEADER = document.querySelector("header");

const CATALOG_URL =
  "https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=319199393&SalesTypeFilter=1&Limit=30";

const THUMB_PROXY =
  "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/?url=";

const CACHE = {
  catalog: null,
};

let particlesPaused = false;

/* ================================
   FETCH + CACHE
================================ */
async function fetchCatalog() {
  if (CACHE.catalog) return CACHE.catalog;

  const res = await fetch(CATALOG_URL);
  const data = await res.json();
  CACHE.catalog = data.data || [];
  return CACHE.catalog;
}

/* ================================
   CREATE CARD
================================ */
function createCard(item) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = `https://www.roblox.com/catalog/${item.id}`;
  a.target = "_blank";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src =
    THUMB_PROXY +
    encodeURIComponent(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png&type=Asset`
    );

  const name = document.createElement("p");
  name.textContent = item.name;

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = item.price ? `${item.price} R$` : "Offsale";

  a.append(img, name, price);
  return a;
}

/* ================================
   RENDER STORE
================================ */
async function renderStore() {
  const items = await fetchCatalog();
  STORE.innerHTML = "";

  items.forEach((item) => {
    STORE.appendChild(createCard(item));
  });

  init3DHover();
}

/* ================================
   3D HOVER (THROTTLED)
================================ */
function init3DHover() {
  const cards = document.querySelectorAll(".card");
  let last = 0;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - last < 60) return;
      last = now;

      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const rx = ((y / r.height) - 0.5) * -10;
      const ry = ((x / r.width) - 0.5) * 10;

      card.style.transform = `
        perspective(900px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
        translateZ(15px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => {
        if (c !== card) c.classList.add("dimmed");
      });
    });

    card.addEventListener("mouseleave", () => {
      cards.forEach((c) => c.classList.remove("dimmed"));
    });
  });
}

/* ================================
   HEADER SCROLL FADE
================================ */
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const fade = Math.max(0, 1 - y / 300);

  HEADER.style.opacity = fade;
  HEADER.style.transform = `scale(${0.95 + fade * 0.05})`;
});

/* ================================
   PARTICLES (RAIN)
================================ */
const canvas = document.createElement("canvas");
canvas.id = "particles";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function createParticles() {
  particles = [];
  const count =
    window.innerWidth < 600 ? 40 :
    window.innerWidth < 1200 ? 70 : 110;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      v: 1 + Math.random() * 2,
      l: 10 + Math.random() * 20,
    });
  }
}
createParticles();

function drawParticles() {
  if (particlesPaused) return;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y + p.l);
    ctx.stroke();

    p.y += p.v;
    if (p.y > H) p.y = -20;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ================================
   VISIBILITY PAUSE
================================ */
document.addEventListener("visibilitychange", () => {
  particlesPaused = document.hidden;
});

/* ================================
   INIT
================================ */
renderStore();
