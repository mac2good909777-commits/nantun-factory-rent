/* 地圖 / 街景 iframe：用 data-map（地址）或 data-sv（緯經度）產生免金鑰嵌入網址 */
document.querySelectorAll("iframe[data-map]").forEach(f=>{
  f.src = "https://maps.google.com/maps?q=" + encodeURIComponent(f.dataset.map) + "&z=17&hl=zh-TW&output=embed";
});
document.querySelectorAll("iframe[data-sv]").forEach(f=>{
  f.src = "https://maps.google.com/maps?q=&layer=c&cbll=" + f.dataset.sv + "&cbp=11,0,0,0,0&hl=zh-TW&output=svembed";
});

/* 照片燈箱 */
const imgs = [...document.querySelectorAll("img[data-lb]")];
const lb = document.getElementById("lb"), lbimg = document.getElementById("lbimg");
let idx = 0;
imgs.forEach((im,i)=> im.addEventListener("click", ()=>{ idx=i; show(); }));
function show(){ if(!imgs.length) return; idx=(idx+imgs.length)%imgs.length;
  lbimg.src = imgs[idx].src; lbimg.alt = imgs[idx].alt; lb.classList.add("on"); }
function step(d){ idx+=d; show(); }
function closeLb(){ lb.classList.remove("on"); lbimg.removeAttribute("src"); }
lb.addEventListener("click", e=>{ if(e.target===lb) closeLb(); });
document.addEventListener("keydown", e=>{
  if(!lb.classList.contains("on")) return;
  if(e.key==="Escape") closeLb();
  if(e.key==="ArrowRight") step(1);
  if(e.key==="ArrowLeft") step(-1);
});

/* ---------- 區位圖（Leaflet）---------- */
if (document.getElementById("locmap") && window.L) {
  const CASES = [
    {n:"", t:"萬和南一路 209 號", s:"約45坪/間・挑高約8米・共4間（合併一樓約180坪）", ll:[24.130262,120.635346]}
  ];
  const NODES = [
    {c:"c1", t:"國道 1 號（中山高）南屯交流道", ll:[24.15134,120.62003]},
    {c:"c2", t:"高鐵台中站（烏日）", ll:[24.11007,120.61400]},
    {c:"c3", t:"台中精密機械科技創新園區（精科）", ll:[24.14768,120.60624]},
    {c:"c4", t:"台中產業園區（台中工業區）", ll:[24.16758,120.60010]},
    {c:"c5", t:"台中市政中心・七期", ll:[24.16303,120.64574]}
  ];
  const COLOR = {c1:"#b3541e", c2:"#7a4fa3", c3:"#1f6f8b", c4:"#3d7a4e", c5:"#8a6d10"};

  const map = L.map("locmap", {scrollWheelZoom:false});
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {maxZoom:18, attribution:"© OpenStreetMap contributors"}).addTo(map);

  const all = [];
  NODES.forEach(n=>{
    all.push(n.ll);
    L.marker(n.ll, {icon: L.divIcon({className:"", iconSize:[14,14], iconAnchor:[7,7],
      html:`<div style="width:14px;height:14px;border-radius:50%;background:${COLOR[n.c]};
        border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></div>`})})
      .addTo(map).bindTooltip(n.t, {direction:"top", offset:[0,-8]});
  });
  CASES.forEach(c=>{
    all.push(c.ll);
    L.marker(c.ll, {zIndexOffset:1000, icon: L.divIcon({className:"", iconSize:[58,30], iconAnchor:[29,15],
      html:`<div style="width:58px;height:30px;border-radius:15px;background:#2B5937;color:#fff;
        border:3px solid #C0A434;box-shadow:0 2px 8px rgba(0,0,0,.5);display:flex;
        align-items:center;justify-content:center;font:800 14px/1 sans-serif;letter-spacing:.05em">本案</div>`})})
      .addTo(map)
      .bindTooltip(c.t, {direction:"top", offset:[0,-16]})
      .bindPopup(`<b>${c.t}</b><br>${c.s}`);
    /* 本案 → 各節點的連線，讓不熟台中的人一眼看出相對關係 */
    NODES.forEach(n=> L.polyline([c.ll, n.ll],
      {color:COLOR[n.c], weight:1.3, opacity:.5, dashArray:"4 5"}).addTo(map));
  });

  map.fitBounds(L.latLngBounds(all).pad(0.12));
  setTimeout(()=>map.invalidateSize(), 300);
}
