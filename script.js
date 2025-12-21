const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your Cloudflare Worker URL
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

// Recursive function to load all pages
async function loadClothing(cursor = "") {
  try {
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

    if (!searchData.data || !searchData.data.length) return;

    // Render items from search API
    searchData.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png">
        <p>${item.name}</p>
        <div class="price">${item.price ? item.price : "0"} R$</div>
      `;

      store.appendChild(card);
    });

    // Load next page
    if (searchData.nextPageCursor) {
      loadClothing(searchData.nextPageCursor);
    }
  } catch (err) {
    console.error("Error fetching clothing:", err);
  }
}

// Start loading
loadClothing();
