const GROUP_ID = 319199393;
const store = document.getElementById("store");

const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";
const PLACEHOLDER_IMAGE = "placeholder.png"; // surreal fallback

async function loadClothing(cursor = "") {
  try {
    const searchURL =
      WORKER_URL +
      "?url=" +
      encodeURIComponent(
        `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30` +
          (cursor ? `&Cursor=${cursor}` : "")
      );

    const res = await fetch(searchURL);
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    data.data.forEach(item => {
      const id = item.id;
      const name = item.name || "Untitled";
      const price = item.priceInRobux || 7; // fallback price

      // Use product.assetId if available
      const assetId = item.product?.assetId || id;
      const thumbUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png`;

      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="${thumbUrl}" onerror="this.src='${PLACEHOLDER_IMAGE}'" alt="${name}">
        <p>${name}</p>
        <div class="price">${price} R$</div>
      `;

      store.appendChild(card);
    });

    if (data.nextPageCursor) {
      loadClothing(data.nextPageCursor);
    }
  } catch (err) {
    console.error("Error fetching clothing:", err);
  }
}

loadClothing();
const GROUP_ID = 319199393;
const store = document.getElementById("store");

const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";
const PLACEHOLDER_IMAGE = "placeholder.png"; // surreal fallback

async function loadClothing(cursor = "") {
  try {
    const searchURL =
      WORKER_URL +
      "?url=" +
      encodeURIComponent(
        `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30` +
          (cursor ? `&Cursor=${cursor}` : "")
      );

    const res = await fetch(searchURL);
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    data.data.forEach(item => {
      const id = item.id;
      const name = item.name || "Untitled";
      const price = item.priceInRobux || 7; // fallback price

      // Use product.assetId if available
      const assetId = item.product?.assetId || id;
      const thumbUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png`;

      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="${thumbUrl}" onerror="this.src='${PLACEHOLDER_IMAGE}'" alt="${name}">
        <p>${name}</p>
        <div class="price">${price} R$</div>
      `;

      store.appendChild(card);
    });

    if (data.nextPageCursor) {
      loadClothing(data.nextPageCursor);
    }
  } catch (err) {
    console.error("Error fetching clothing:", err);
  }
}

loadClothing();
