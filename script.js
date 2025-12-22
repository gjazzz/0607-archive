const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/?url=";

async function loadClothing(cursor = "") {
  try {
    // 1️⃣ Fetch group items
    let apiURL = `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30`;
    if (cursor) apiURL += `&Cursor=${cursor}`;

    const res = await fetch(WORKER_URL + encodeURIComponent(apiURL));
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    // 2️⃣ Render each item
    data.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      // ✅ Real Roblox thumbnail
      card.innerHTML = `
        <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png&type=Asset" />
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;
      store.appendChild(card);
    });

    // 3️⃣ Recursively fetch next page if exists
    if (data.nextPageCursor) loadClothing(data.nextPageCursor);

  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Start
loadClothing();
