const GROUP_ID = 319199393;
const STORE = document.getElementById("store");
const WORKER = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev";

// ----------------------------
// FETCH CLOTHING
// ----------------------------
async function fetchClothing(cursor = "") {
  const url =
    WORKER +
    "?url=" +
    encodeURIComponent(
      "https://catalog.roblox.com/v1/search/items?" +
      "Category=3" +
      "&AssetTypes=Shirt,Pants" +
      "&CreatorType=Group" +
      `&CreatorTargetId=${GROUP_ID}` +
      "&SalesTypeFilter=1" +
      "&Limit=30" +
      (cursor ? `&Cursor=${cursor}` : "")
    );

  const res = await fetch(url);
  if (!res.ok) throw new Error("Catalog fetch failed");

  return res.json();
}

// ----------------------------
// FETCH THUMBNAILS
// ----------------------------
async function fetchThumbnails(ids) {
  const url =
    WORKER +
    "?url=" +
    encodeURIComponent(
      "https://thumbnails.roblox.com/v1/assets?" +
      `assetIds=${ids.join(",")}` +
      "&size=420x420" +
      "&format=Png"
    );

  const res = await fetch(url);
  if (!res.ok) throw new Error("Thumbnail fetch failed");

  return (await res.json()).data;
}

// ----------------------------
// RENDER CARDS
// ----------------------------
function renderCards(items, thumbnails) {
  const thumbMap = {};
  thumbnails.forEach(t => {
    if (t.state === "Completed") thumbMap[t.targetId] = t.imageUrl;
  });

  items.forEach(item => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `https://www.roblox.com/catalog/${item.id}`;
    card.target = "_blank";

    card.innerHTML = `
      <img src="${thumbMap[item.id]}" alt="">
      <p>Unique Piece</p>
      <div class="price">7 R$</div>
    `;

    STORE.appendChild(card);
  });
}

// ----------------------------
// 3D TILT
// ----------------------------
function apply3DTilt() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform =
        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

      card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.4)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
    });
  });
}

// ----------------------------
// LOAD ALL CLOTHING
// ----------------------------
async function loadAll(cursor = "") {
  const data = await fetchClothing(cursor);
  const ids = data.data.map(i => i.id);
  if (!ids.length) return;

  const thumbnails = await fetchThumbnails(ids);
  renderCards(data.data, thumbnails);

  if (data.nextPageCursor) {
    await loadAll(data.nextPageCursor);
  } else {
    apply3DTilt();
  }
}

loadAll().catch(err => console.error("LOAD FAILED:", err));

// ----------------------------
// MUSIC CONTROL (STABLE)
// ----------------------------
const music = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volume");
const musicBtn = document.getElementById("musicBtn");

let musicStarted = false;

// default volume
if (music) music.volume = volumeSlider.value;

// volume slider
if (volumeSlider) {
  volumeSlider.addEventListener("input", e => {
    if (music) music.volume = e.target.value;
  });
}

// toggle button
if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (!musicStarted && music) {
      music.play().then(() => {
        musicStarted = true;
        musicBtn.textContent = "🔊";
      }).catch(() => {});
      return;
    }

    if (music.paused) {
      music.play();
      musicBtn.textContent = "🔊";
    } else {
      music.pause();
      musicBtn.textContent = "🔈";
    }
  });
}

// browser-safe start on first interaction
document.addEventListener("click", () => {
  if (!musicStarted && music) {
    music.play().then(() => {
      musicStarted = true;
    }).catch(() => {});
  }
}, { once: true });

// ----------------------------
// PARTICLES
// ----------------------------
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let drops = [];
for (let i = 0; i < 120; i++) {
  drops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 15 + 10,
    speed: Math.random() * 2 + 2
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;

  drops.forEach(d => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.length);
    ctx.stroke();
    d.y += d.speed;
    if (d.y > canvas.height) {
      d.y = -d.length;
      d.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
