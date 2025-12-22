const GROUP_ID = 319199393;
const STORE = document.getElementById("store");

// ✅ YOUR REAL CLOUDFLARE WORKER
const WORKER = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev";

// ----------------------------
// 1️⃣ FETCH ALL GROUP CLOTHING
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

  const data = await res.json();
  return data;
}

// ----------------------------
// 2️⃣ FETCH REAL THUMBNAILS
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

  const data = await res.json();
  return data.data;
}

// ----------------------------
// 3️⃣ RENDER CARDS
// ----------------------------
function renderCards(items, thumbnails) {
  const thumbMap = {};
  thumbnails.forEach(t => {
    if (t.state === "Completed") {
      thumbMap[t.targetId] = t.imageUrl;
    }
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
// 4️⃣ 3D CURSOR TILT (REAL)
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

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform =
        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

      card.style.boxShadow =
        "0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,255,0.4)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.4)";
    });
  });
}

// ----------------------------
// 5️⃣ MASTER LOAD (RECURSIVE)
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
    // ✅ ONLY APPLY TILT AFTER EVERYTHING EXISTS
    apply3DTilt();
  }
}

// 🚀 START
loadAll().catch(err => {
  console.error("LOAD FAILED:", err);
});
