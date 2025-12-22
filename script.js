const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Your CORS Proxy URL for Roblox API requests
const WORKER_URL = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev/";

// Subcategories: 3 = Shirts, 4 = Pants
const SUBCATEGORIES = [3, 4];

async function fetchClothing(subcategory) {
  let cursor = "";
  do {
    // Construct API URL via CORS proxy
    const url = WORKER_URL + "?url=" + encodeURIComponent(
      `https://catalog.roblox.com/v1/search/items?Category=3&Subcategory=${subcategory}&CreatorType=2&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30` +
      (cursor ? `&Cursor=${cursor}` : "")
    );

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.data || !data.data.length) break;

      data.data.forEach(item => {
        // Use Roblox thumbnail API for image
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

      cursor = data.nextPageCursor || "";
    } catch (err) {
      console.error("Error fetching clothing:", err);
      break;
    }
  } while (cursor);
}

// Fetch both shirts and pants
SUBCATEGORIES.forEach(sub => fetchClothing(sub));
