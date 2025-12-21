const GROUP_ID = 319199393;
const store = document.getElementById("store");

// Free public CORS proxy
const PROXY = "https://cors.isomorphic-git.org/";

async function load(cursor = "") {
  const searchURL =
    PROXY +
    "https://catalog.roblox.com/v1/search/items?" +
    "Category=3" +
    "&AssetTypes=Shirt,Pants" +
    "&CreatorType=Group" +
    `&CreatorTargetId=${GROUP_ID}` +
    "&SalesTypeFilter=1" +
    "&Limit=30" +
    (cursor ? `&Cursor=${cursor}` : "");

  const searchRes = await fetch(searchURL);
  const searchData = await searchRes.json();

  const ids = searchData.data.map(i => i.id);
  if (ids.length === 0) return;

  const detailsRes = await fetch(
    PROXY + "https://catalog.roblox.com/v1/catalog/items/details",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: ids.map(id => ({ id, itemType: "Asset" }))
      })
    }
  );

  const detailsData = await detailsRes.json();

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

  if (searchData.nextPageCursor) {
    load(searchData.nextPageCursor);
  }
}

load();
