const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL (CORS proxy)
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

// Subcategories: 3 = Shirts, 4 = Pants
const SUBCATEGORIES = [3, 4];

async function fetchClothing(subcategory, cursor = "") {
  try {
    // Construct Roblox API URL
    let robloxUrl = `https://catalog.roblox.com/v1/search/items?Category=3&Subcategory=${subcategory}&CreatorType=2&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30`;
    if (cursor) robloxUrl += `&Cursor=${cursor}`;

    // Always call **via your CORS proxy**
    const proxyUrl = WORKER_URL + "?url=" + encodeURIComponent(robloxUrl);

    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    data.data.forEach(item => {
      const imgUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png`;

      const card = document.createElement("a");
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";
      card.className = "card";

      card.innerHTML = `
        <img src="${imgUrl}" />
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;

      store.appendChild(card);
    });

    if (data.nextPageCursor) {
      fetchClothing(subcategory, data.nextPageCursor);
    }

  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Fetch shirts and pants separately
SUBCATEGORIES.forEach(sub => fetchClothing(sub));
