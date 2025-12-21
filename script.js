const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

async function loadClothing(cursor = "") {
  try {
    // Step 1 — Fetch item IDs from Roblox
    const searchURL =
      WORKER_URL +
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

    const searchRes = await fetch(searchURL);
    const searchData = await searchRes.json();

    const ids = searchData.data.map(item => item.id);
    if (!ids.length) return;

    // Step 2 — Fetch item details
    const detailsRes = await fetch(
      WORKER_URL +
        "?url=" +
        encodeURIComponent("https://catalog.roblox.com/v1/catalog/items/details"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: ids.map(id => ({ id, itemType: "Asset" }))
        })
      }
    );

    const detailsData = await detailsRes.json();

    // Step 3 — Render items
    detailsData.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png">
        <p>${item.name}</p>
        <div class="price">${item.price} R$</div>
      `;

      store.appendChild(card);
    });

    // Step 4 — Load next page recursively
    if (searchData.nextPageCursor) {
      loadClothing(searchData.nextPageCursor);
    }
  } catch (err) {
    console.error("Error fetching clothing:", err);
  }
}

// Start loading
loadClothing();
