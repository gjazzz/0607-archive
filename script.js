const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/?url=";

// Fetch all clothing (shirts + pants), handling pagination
async function loadClothing(cursor = "") {
  try {
    // Step 1 — Fetch group clothing IDs
    const searchURL =
      `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30` +
      (cursor ? `&Cursor=${cursor}` : "");

    const searchRes = await fetch(WORKER_URL + encodeURIComponent(searchURL));
    const searchData = await searchRes.json();

    if (!searchData.data || !searchData.data.length) return;

    // Step 2 — For each item, get the real thumbnail
    for (const item of searchData.data) {
      const thumbAPI = `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png&type=Asset`;
      const thumbRes = await fetch(WORKER_URL + encodeURIComponent(thumbAPI));
      const thumbData = await thumbRes.json();
      const imageUrl = thumbData.data[0]?.imageUrl || "";

      // Step 3 — Render card
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="${imageUrl}" />
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;

      store.appendChild(card);
    }

    // Step 4 — Load next page if exists
    if (searchData.nextPageCursor) {
      loadClothing(searchData.nextPageCursor);
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Start loading all clothing
loadClothing();
