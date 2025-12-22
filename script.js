// ----------------------------
// INIT FADE-IN & HEADER/SOCIAL
// ----------------------------
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.querySelector("header").classList.add("show");
  document.querySelector(".social-btns").classList.add("show");
});

// ----------------------------
// ROBLOX CLOTHING
// ----------------------------
const GROUP_ID = 319199393;
const STORE = document.getElementById("store");
const WORKER = "https://roblox-catalog-proxy.gianlucafoti36.workers.dev";

async function fetchClothing(cursor="") {
  const url = WORKER+"?url="+encodeURIComponent(
    `https://catalog.roblox.com/v1/search/items?Category=3&AssetTypes=Shirt,Pants&CreatorType=Group&CreatorTargetId=${GROUP_ID}&SalesTypeFilter=1&Limit=30${cursor?`&Cursor=${cursor}`:""}`
  );
  const res = await fetch(url);
  if(!res.ok) throw new Error("Catalog fetch failed");
  return res.json();
}

async function fetchThumbnails(ids) {
  const url = WORKER+"?url="+encodeURIComponent(
    `https://thumbnails.roblox.com/v1/assets?assetIds=${ids.join(",")}&size=420x420&format=Png`
  );
  const res = await fetch(url);
  if(!res.ok) throw new Error("Thumbnail fetch failed");
  return (await res.json()).data;
}

function renderCards(items, thumbnails){
  const thumbMap = {};
  thumbnails.forEach(t => { if(t.state==="Completed") thumbMap[t.targetId]=t.imageUrl; });
  items.forEach(item => {
    const card=document.createElement("a");
    card.className="card";
    card.href=`https://www.roblox.com/catalog/${item.id}`;
    card.target="_blank";
    card.innerHTML=`
      <img src="${thumbMap[item.id]}" alt="">
      <p>Unique Piece</p>
      <div class="price">7 R$</div>
    `;
    STORE.appendChild(card);
    setTimeout(()=>card.classList.add("show"),100);
  });
}

function apply3DTilt(){
  document.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      const centerX=rect.width/2;
      const centerY=rect.height/2;
      const rotateX=((y-centerY)/centerY)*-5;
      const rotateY=((x-centerX)/centerX)*5;
      card.style.transform=`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.boxShadow="0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,255,0.4)";
    });
    card.addEventListener("mouseleave",()=>{
      card.style.transform="perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow="0 10px 25px rgba(0,0,0,0.4)";
    });
  });
}

async function loadAll(cursor=""){
  const data=await fetchClothing(cursor);
  const ids=data.data.map(i=>i.id);
  if(!ids.length) return;
  const thumbnails=await fetchThumbnails(ids);
  renderCards(data.data,thumbnails);
  if(data.nextPageCursor) await loadAll(data.nextPageCursor);
  else apply3DTilt();
}
loadAll().catch(err=>console.error("LOAD FAILED:",err));

// ----------------------------
// MUSIC CONTROL
// ----------------------------
const music = document.getElementById("bg-music");         // matches <audio id="bg-music">
const volumeSlider = document.getElementById("volume-slider"); // matches <input id="volume-slider">
const musicBtn = document.getElementById("music-toggle");  // matches <button id="music-toggle">

// Set initial volume
music.volume = volumeSlider.value;

// Play/pause toggle
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch(() => {
      console.log("User interaction required to play audio.");
    });
    musicBtn.textContent = "🔊";
  } else {
    music.pause();
    musicBtn.textContent = "🔈";
  }
});

// Volume slider control
volumeSlider.addEventListener("input", (e) => {
  music.volume = e.target.value;
});


// ----------------------------
// PARTICLES
// ----------------------------
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth; canvas.height=innerHeight;
class Particle{
  constructor(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.radius=Math.random()*2+1; this.speed=Math.random()*1+0.5; }
  update(){ this.y-=this.speed; if(this.y<0) this.y=canvas.height; }
  draw(){ ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fill(); }
}
const particlesArray=[];
for(let i=0;i<150;i++) particlesArray.push(new Particle());
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particlesArray.forEach(p=>{ p.update(); p.draw(); }); requestAnimationFrame(animateParticles); }
animateParticles();

// ----------------------------
// REVEAL ON SCROLL
// ----------------------------
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("show");
  });
},{threshold:0.1});
document.querySelectorAll(".card").forEach(c=>observer.observe(c));
