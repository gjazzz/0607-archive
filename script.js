const GROUP_ID = 319199393;
const store = document.getElementById("store");

const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

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

    searchData.data.forEach(item => {
      const id = item.id;
      const name = item.name || "Untitled";
      const price = item.priceInRobux || "0";

      // Use product.assetId if exists, otherwise fallback to item.id
      const assetId = item.product?.assetId || id;

      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png" alt="${name}">
        <p>${name}</p>
        <div class="price">${price} R$</div>
      `;

      store.appendChild(card);
    });

    if (searchData.nextPageCursor) {
      loadClothing(searchData.nextPageCursor);
    }
  } catch (err) {
    console.error("Error fetching clothing:", err);
  }
}

loadClothing();
