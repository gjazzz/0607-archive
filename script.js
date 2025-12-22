const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your CORS proxy
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

async function loadClothing(subcategory = 3, cursor = "") {
  try {
    // Step 1 — Build the full Roblox URL
    let robloxURL = `https://catalog.roblox.com/v1/search/items?Category=3&Subcategory=${subcategory}&CreatorType=2&CreatorTargetId=${GROUP_ID}&IncludeNotForSale=false&Limit=30`;
    if (cursor) robloxURL += `&Cursor=${cursor}`;

    // Step 2 — Encode Roblox URL and call your proxy
    const proxyURL = WORKER_URL + "?url=" + encodeURIComponent(robloxURL);

    const res = await fetch(proxyURL);
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    // Step 3 — Render cards
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

    // Step 4 — Fetch next page if exists
    if (data.nextPageCursor) {
      loadClothing(subcategory, data.nextPageCursor);
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Fetch shirts and pants
loadClothing(3); // Shirts
loadClothing(4); // Pants
