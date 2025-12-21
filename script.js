const GROUP_ID = 319199393;
const store = document.getElementById("store");

async function fetchAll(cursor = "") {
  const url =
    "https://catalog.roblox.com/v1/search/items?" +
    "Category=3" +
    "&AssetTypes=Shirt,Pants" +
    "&CreatorType=Group" +
    `&CreatorTargetId=${GROUP_ID}` +
    "&SalesTypeFilter=1" +       // ONLY items for sale
    "&Limit=30" +
    (cursor ? `&Cursor=${cursor}` : "");

  const res = await fetch(url);
  const json = await res.json();

  json.data.forEach(item => {
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

  if (json.nextPageCursor) {
    fetchAll(json.nextPageCursor);
  }
}

fetchAll();
