const GROUP_ID = 319199393;
const store = document.getElementById("store");

async function fetchAllClothing(cursor = "") {
  const url =
    `https://catalog.roblox.com/v1/search/items/details?` +
    `Category=3&CreatorType=2&CreatorTargetId=${GROUP_ID}` +
    `&IncludeNotForSale=false&Limit=30` +
    (cursor ? `&Cursor=${cursor}` : "");

  const res = await fetch(url);
  const data = await res.json();

  data.data.forEach(item => {
    const card = document.createElement("a");
    card.href = `https://www.roblox.com/catalog/${item.id}`;
    card.target = "_blank";
    card.className = "card";

    card.innerHTML = `
      <img src="https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png" />
      <p>${item.name}</p>
      <div class="price">${item.price} R$</div>
    `;

    store.appendChild(card);
  });

  if (data.nextPageCursor) {
    fetchAllClothing(data.nextPageCursor);
  }
}

fetchAllClothing();

