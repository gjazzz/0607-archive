const GROUP_ID = 319199393;
const store = document.getElementById("store");

// PUBLIC SEARCH API (works without auth)
const SEARCH_URL =
  "https://catalog.roblox.com/v1/search/items" +
  "?Category=3" +
  "&AssetTypes=Shirt,Pants" +
  "&CreatorType=Group" +
  `&CreatorTargetId=${GROUP_ID}` +
  "&SalesTypeFilter=1" +
  "&Limit=30";

// thumbnail generator (PUBLIC, FREE)
function getThumbnail(assetId) {
  return `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png&isCircular=false`;
}

async function loadClothing() {
  try {
    const res = await fetch(SEARCH_URL);
    const data = await res.json();

    if (!data.data || !data.data.length) return;

    data.data.forEach(item => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `https://www.roblox.com/catalog/${item.id}`;
      card.target = "_blank";

      card.innerHTML = `
        <img src="${getThumbnail(item.id)}" loading="lazy">
        <p>Unique Piece</p>
        <div class="price">7 R$</div>
      `;

      store.appendChild(card);
    });

  } catch (err) {
    console.error("Load failed:", err);
  }
}

// START
loadClothing();
