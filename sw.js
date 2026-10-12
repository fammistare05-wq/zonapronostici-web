/* Zona Pronostici - service worker: pagine e dati sempre freschi dalla rete; stili e immagini dalla cache ma riaggiornati subito in background */
const C="zp-v2";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==="navigate"||u.pathname.endsWith(".html")||u.pathname.endsWith(".json")||u.pathname==="/"){
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{const c=res.clone();caches.open(C).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("/"))));return}
 if(/\/(img|assets)\//.test(u.pathname)||/\.(png|jpg|svg|css|js|webmanifest)$/.test(u.pathname)){
  e.respondWith(caches.open(C).then(x=>x.match(r).then(m=>{const net=fetch(r,{cache:"no-cache"}).then(res=>{if(res.ok)x.put(r,res.clone());return res}).catch(()=>m);return m||net})))}});
