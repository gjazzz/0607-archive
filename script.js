const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL (add trailing ?url=)
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/?url=";

async function loadClothing(cursor = "") {
  try {
    // Step 1 — Get all clothing items (shirts + pants)
    let apiURL = `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30`;
    if (cursor) apiURL += `&Cursor=${cursor}`;

    const res = await fetch(WORKER_URL + encodeURIComponent(apiURL));
    const data = await res.json();
    if (!data.data || !data.data.length) return;

    // Step 2 — Render items
    data.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      // Thumbnail via Worker
      const thumbURL = `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png&type=Asset`;
      card.innerHTML = `
        <img src="${WORKER_URL + encodeURIComponent(thumbURL)}" />
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;
      store.appendChild(card);
    });

    // Step 3 — Load next page recursively
    if (data.nextPageCursor) loadClothing(data.nextPageCursor);
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Start loading
loadClothing();
