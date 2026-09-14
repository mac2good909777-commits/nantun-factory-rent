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
