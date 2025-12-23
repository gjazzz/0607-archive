document.body.classList.add('loaded');

// ----------------------------
// ROBLOX STORE
// ----------------------------
const GROUP_ID = 319199393;
const STORE = document.getElementById("store");
const WORKER = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev";

async function fetchClothing(cursor = "") {
  const url = WORKER + "?url=" + encodeURIComponent(
    "https://catalog.roblox.com/v1/search/items?" +
    "Category=3" +
    "&AssetTypes=Shirt,Pants" +
    "&CreatorType=Group" +
    `&CreatorTargetId=${GROUP_ID}` +
    "&SalesTypeFilter=1" +
    "&Limit=30" +
    (cursor ? `&Cursor=${cursor}` : "")
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error("Catalog fetch failed");
  return res.json();
}

async function fetchThumbnails(ids) {
  const url = WORKER + "?url=" + encodeURIComponent(
    "https://thumbnails.roblox.com/v1/assets?" +
    `assetIds=${ids.join(",")}` +
    "&size=420x420" +
    "&format=Png"
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error("Thumbnail fetch failed");
  return (await res.json()).data;
}

function renderCards(items, thumbnails) {
  const thumbMap = {};
  thumbnails.forEach(t => { if(t.state==="Completed") thumbMap[t.targetId]=t.imageUrl; });
  items.forEach(item => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `https://www.roblox.com/catalog/${item.id}`;
    card.target = "_blank";
    card.innerHTML = `<img src="${thumbMap[item.id]}" alt=""><p>Unique Piece</p><div class="price">7 R$</div>`;
    STORE.appendChild(card);
  });
}

function apply3DTilt() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY)/centerY)*-5;
      const rotateY = ((x - centerX)/centerX)*5;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.6),0 0 30px rgba(255,255,255,0.5)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
    });
  });
}

async function loadAll(cursor="") {
  const data = await fetchClothing(cursor);
  const ids = data.data.map(i=>i.id);
  if(!ids.length) return;
  const thumbnails = await fetchThumbnails(ids);
  renderCards(data.data, thumbnails);
  if(data.nextPageCursor) await loadAll(data.nextPageCursor);
  else apply3DTilt();
}

loadAll().catch(err=>console.error("LOAD FAILED:", err));

// ----------------------------
// MUSIC CONTROLS
// ----------------------------
const music = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volume");
const musicBtn = document.getElementById("musicBtn");
music.volume = volumeSlider.value;
volumeSlider.addEventListener("input", e=>music.volume=e.target.value);
musicBtn.addEventListener("click", ()=>{
  if(music.paused){ music.play(); musicBtn.textContent="🔊"; }
  else { music.pause(); musicBtn.textContent="🔈"; }
});

// ----------------------------
// PARTICLES
// ----------------------------
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth; canvas.height = innerHeight;

class Particle {
  constructor(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.radius=Math.random()*2+1; this.speed=Math.random()*1+0.5; }
  update(){ this.y -= this.speed; if(this.y<0) this.y=canvas.height; }
  draw(){ ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fill(); }
}
const particlesArray=[]; for(let i=0;i<150;i++) particlesArray.push(new Particle());
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particlesArray.forEach(p=>{ p.update(); p.draw(); }); requestAnimationFrame(animateParticles);}
animateParticles();
window.addEventListener("resize",()=>{ canvas.width=innerWidth; canvas.height=innerHeight; });

// ----------------------------
// BACKGROUND PARALLAX (MOUSE)
document.addEventListener('mousemove',e=>{
  const moveX=(e.clientX/window.innerWidth-0.5)*20; // horizontal
  const moveY=(e.clientY/window.innerHeight-0.5)*20; // vertical
  document.body.style.backgroundPosition=`calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
});
