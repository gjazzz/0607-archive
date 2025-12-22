const GROUP_ID = 319199393;
const store = document.getElementById("store");

// ✅ Your actual Cloudflare Worker URL
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/?url=";

// Fetch clothing from Roblox via Worker
async function loadClothing(cursor = "") {
  try {
    // Step 1 — Construct search URL
    let apiURL = `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30`;
    if (cursor) apiURL += `&Cursor=${cursor}`;

    // Step 2 — Fetch via Worker
    const res = await fetch(WORKER_URL + encodeURIComponent(apiURL));
    const data = await res.json();

    // Step 3 — Render each item
    data.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png">
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;

      store.appendChild(card);
    });

    // Step 4 — Load next page if exists
    if (data.nextPageCursor) {
      loadClothing(data.nextPageCursor);
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Start loading
loadClothing();
