const STORE = {
  cart: 'furniro-cart',
  compare: 'furniro-compare',
  recent: 'furniro-recent',
  shipping: 'furniro-shipping'
};

const money = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];
const getJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const pageName = document.body.dataset.page || '';
let products = [], blogs = [];

function logoHTML(){
  return `<a href="index.html" class="flex items-center gap-2 shrink-0" aria-label="Furniro home">
    <span class="relative grid h-7 w-7 place-items-center">
      <span class="absolute h-5 w-5 rotate-45 border-[3px] border-[#B88E2F]"></span>
      <span class="absolute h-1.5 w-1.5 rounded-full bg-[#B88E2F]"></span>
    </span>
    <span class="text-[24px] font-bold tracking-tight text-[#333]">Furniro</span>
  </a>`;
}

function headerHTML(){
  return `<header class="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 lg:px-8">
      ${logoHTML()}
      <nav class="hidden items-center gap-10 lg:flex" aria-label="Primary">
        <a href="index.html" class="nav-link" data-link="home">Home</a>
        <a href="shop.html" class="nav-link" data-link="shop">Shop</a>
        <a href="about.html" class="nav-link" data-link="about">About</a>
        <a href="contact.html" class="nav-link" data-link="contact">Contact</a>
      </nav>
      <div class="flex items-center gap-4">
        <button class="icon-btn hidden md:inline-flex" data-action="account" aria-label="Account">♙</button>
        <button class="icon-btn" data-action="search" aria-label="Search">⌕</button>
        <a href="compare.html" class="icon-btn" aria-label="Compare">♡</a>
        <button class="icon-btn relative" data-action="cart" aria-label="Cart"><span>🛒</span><span class="cart-badge">0</span></button>
        <button class="lg:hidden icon-btn" data-action="mobile-menu" aria-label="Open menu">☰</button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden border-t border-black/5 bg-white lg:hidden">
      <nav class="mx-auto flex max-w-[1280px] flex-col px-5 py-4" aria-label="Mobile">
        <a class="mobile-nav-link" href="index.html">Home</a>
        <a class="mobile-nav-link" href="shop.html">Shop</a>
        <a class="mobile-nav-link" href="about.html">About</a>
        <a class="mobile-nav-link" href="contact.html">Contact</a>
        <a class="mobile-nav-link" href="compare.html">Compare</a>
        <button class="mobile-nav-link text-left" data-action="cart">Open cart</button>
      </nav>
    </div>
  </header>`;
}

function footerHTML(){
  return `<footer class="border-t border-black/10 bg-white">
    <div class="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
      <div><div class="text-xl font-bold">Furniro.</div><p class="mt-6 max-w-[230px] text-sm leading-6 text-black/50">400 University Drive Suite 200 Coral Gables, FL 33134 USA</p></div>
      <div><div class="text-sm text-black/40">Links</div><div class="mt-6 grid gap-4 text-sm"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a></div></div>
      <div><div class="text-sm text-black/40">Help</div><div class="mt-6 grid gap-4 text-sm"><a href="checkout.html">Payment Options</a><a href="cart.html">Returns</a><a href="#">Privacy Policies</a></div></div>
      <div><div class="text-sm text-black/40">Newsletter</div><form class="mt-6 flex gap-2" data-form="subscribe"><input class="line-input w-full" required type="email" placeholder="Enter Your Email Address" aria-label="Email"><button class="text-xs font-semibold underline underline-offset-4">SUBSCRIBE</button></form><p class="mt-2 hidden text-xs text-red-600" data-error="subscribe"></p></div>
    </div>
    <div class="mx-auto max-w-[1180px] border-t border-black/10 px-5 py-5 text-xs text-black/60 lg:px-8">2026 Furniro. All rights reserved</div>
  </footer>`;
}

function cartDrawerHTML(){
  return `<div id="cart-overlay" class="pointer-events-none fixed inset-0 z-50 bg-black/30 opacity-0 transition"></div>
  <aside id="cart-drawer" class="fixed right-0 top-0 z-[60] flex h-full w-full max-w-[520px] translate-x-full flex-col bg-white shadow-2xl transition-transform" aria-label="Mini cart" aria-hidden="true">
    <div class="flex items-center justify-between border-b border-black/10 px-8 py-7"><div><div class="text-2xl font-semibold">Shopping Cart</div><div class="mt-1 text-xs text-black/45">Your saved pieces</div></div><button class="icon-btn" data-action="close-cart">✕</button></div>
    <div id="drawer-items" class="flex-1 space-y-3 overflow-y-auto p-6"></div>
    <div class="border-t border-black/10 p-6"><div id="drawer-free" class="mb-4 hidden rounded bg-[#F9F1E7] p-3 text-xs text-[#8C6A20]"></div><div class="flex items-center justify-between text-base"><span>Subtotal</span><strong id="drawer-subtotal">₫0</strong></div><div class="mt-4 flex gap-3"><a href="cart.html" class="btn-outline flex-1 text-center">Cart</a><a href="checkout.html" class="btn-primary flex-1 text-center">Checkout</a></div></div>
  </aside>`;
}

function searchModalHTML(){
  return `<div id="search-modal" class="pointer-events-none fixed inset-0 z-[70] flex items-start justify-center bg-black/30 opacity-0 transition"><div class="mt-24 w-[min(760px,calc(100%-32px))] rounded-2xl bg-white p-6 shadow-2xl"><div class="flex items-center gap-3 border-b border-black/10 pb-4"><span class="text-xl">⌕</span><input id="global-search" class="w-full border-0 bg-transparent text-lg outline-none" placeholder="Search products..." autocomplete="off"><button class="icon-btn" data-action="close-search">✕</button></div><div id="search-results" class="mt-4 grid gap-3"></div></div></div>`;
}

function accountModalHTML(){
  return `<div id="account-modal" class="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-black/30 opacity-0 transition"><div class="w-[min(420px,calc(100%-32px))] rounded-2xl bg-white p-7 shadow-2xl"><div class="flex items-center justify-between"><div class="text-2xl font-semibold">Welcome back</div><button class="icon-btn" data-action="close-account">✕</button></div><form class="mt-6 grid gap-4" data-form="login"><label class="text-sm">Email<input class="form-input mt-2" required type="email"></label><label class="text-sm">Password<input class="form-input mt-2" required minlength="6" type="password"></label><button class="btn-primary">Login</button><p class="hidden text-xs text-red-600" data-error="login"></p></form></div></div>`;
}

function injectShell(){
  const root = qs('[data-app-shell]');
  if(!root) return;
  root.innerHTML = `${headerHTML()}${root.innerHTML}${footerHTML()}${cartDrawerHTML()}${searchModalHTML()}${accountModalHTML()}`;
  setActiveNav(); updateCartBadge();
}

function setActiveNav(){
  qsa('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.link === pageName));
}

function getCart(){return getJSON(STORE.cart, []);} 
function saveCart(cart){setJSON(STORE.cart, cart); updateCartBadge(); renderDrawer();}
function cartCount(){return getCart().reduce((n,i)=>n+i.qty,0);} 
function updateCartBadge(){ qsa('.cart-badge').forEach(b=>b.textContent=cartCount()); }
function addToCart(product, qty=1, size='M', color=product.colors[0]){
  const cart=getCart(); const key=`${product.id}-${size}-${color}`; const hit=cart.find(i=>i.key===key);
  if(hit) hit.qty += qty; else cart.push({key,id:product.id,name:product.name,price:product.price,oldPrice:product.oldPrice,qty,size,color,image:product.image});
  saveCart(cart); openCart();
}
function updateCartItem(key, delta){
  const cart=getCart().map(i=>i.key===key?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0); saveCart(cart); renderCartPage();
}
function removeCartItem(key){ saveCart(getCart().filter(i=>i.key!==key)); renderCartPage(); }
function cartSubtotal(){return getCart().reduce((s,i)=>s+i.price*i.qty,0);} 
function shippingCost(subtotal){return subtotal>=3750000?0:150000;}

function openCart(){const d=qs('#cart-drawer'),o=qs('#cart-overlay'); if(!d||!o)return; d.classList.remove('translate-x-full');d.setAttribute('aria-hidden','false');o.classList.remove('pointer-events-none','opacity-0');o.classList.add('pointer-events-auto','opacity-100');document.body.classList.add('overflow-hidden');renderDrawer();}
function closeCart(){const d=qs('#cart-drawer'),o=qs('#cart-overlay'); if(!d||!o)return; d.classList.add('translate-x-full');d.setAttribute('aria-hidden','true');o.classList.add('pointer-events-none','opacity-0');o.classList.remove('pointer-events-auto','opacity-100');document.body.classList.remove('overflow-hidden');}
function openSearch(){const m=qs('#search-modal'); if(!m)return; m.classList.remove('pointer-events-none','opacity-0'); m.classList.add('pointer-events-auto','opacity-100'); qs('#global-search')?.focus();}
function closeSearch(){const m=qs('#search-modal'); if(!m)return; m.classList.add('pointer-events-none','opacity-0');m.classList.remove('pointer-events-auto','opacity-100');}
function openAccount(){const m=qs('#account-modal'); if(!m)return; m.classList.remove('pointer-events-none','opacity-0');m.classList.add('pointer-events-auto','opacity-100');}
function closeAccount(){const m=qs('#account-modal'); if(!m)return; m.classList.add('pointer-events-none','opacity-0');m.classList.remove('pointer-events-auto','opacity-100');}

function renderDrawer(){
  const box=qs('#drawer-items'); if(!box)return; const cart=getCart();
  box.innerHTML=cart.length?cart.map(i=>`<div class="flex gap-4 rounded-xl bg-[#F9F1E7] p-3"><img class="h-20 w-20 rounded object-cover" src="${i.image}" alt="${i.name}"><div class="min-w-0 flex-1"><div class="flex justify-between gap-3"><div><div class="truncate font-semibold">${i.name}</div><div class="mt-1 text-xs text-black/45">${i.color} · ${i.size}</div></div><button class="text-xs text-black/40 hover:text-red-600" data-remove-cart="${i.key}">Remove</button></div><div class="mt-3 flex items-center justify-between"><div class="flex items-center overflow-hidden rounded border border-black/10 bg-white"><button class="h-8 w-8" data-cart-delta="${i.key}" data-delta="-1">−</button><span class="grid h-8 w-8 place-items-center text-sm">${i.qty}</span><button class="h-8 w-8" data-cart-delta="${i.key}" data-delta="1">+</button></div><strong class="text-sm">${money(i.price*i.qty)}</strong></div></div></div>`).join(''):`<div class="grid h-full place-items-center text-center"><div><div class="text-3xl">🛒</div><p class="mt-3 font-medium">Your cart is empty</p><a class="mt-4 inline-block btn-primary" href="shop.html">Start shopping</a></div></div>`;
  qs('#drawer-subtotal') && (qs('#drawer-subtotal').textContent=money(cartSubtotal()));
  const free=qs('#drawer-free'); if(free){const need=Math.max(0,3750000-cartSubtotal()); free.classList.toggle('hidden',!cart.length||need<=0); free.textContent=need>0?`Buy ${money(need)} more and get free shipping.`:'Free shipping unlocked.';}
}

function productCard(p){
 return `<article class="product-card group"><div class="relative overflow-hidden bg-[#F4F5F7]"><img loading="lazy" class="aspect-[1/1] w-full object-cover transition duration-500 group-hover:scale-[1.03]" src="${p.image}" alt="${p.name} - ${p.description}">${p.tag?`<span class="absolute right-3 top-3 rounded-full ${p.tag==='New'?'bg-emerald-500':'bg-red-400'} px-3 py-1 text-xs font-semibold text-white">${p.tag}</span>`:''}<div class="product-actions"><a href="product.html?id=${p.id}" class="btn-small">View</a><button class="btn-small" data-quick-add="${p.id}">Add</button><button class="btn-small" data-compare="${p.id}">Compare</button></div></div><div class="bg-[#F4F5F7] p-4"><h3 class="text-lg font-semibold">${p.name}</h3><p class="mt-1 text-sm text-black/50">${p.description}</p><div class="mt-2 flex items-end gap-2"><strong>${money(p.price)}</strong>${p.oldPrice?`<span class="text-xs text-black/30 line-through">${money(p.oldPrice)}</span>`:''}</div></div></article>`;
}

async function loadData(){
  const [p,b] = await Promise.all([fetch('data/products.json').then(r=>r.json()), fetch('data/blog.json').then(r=>r.json())]); products=p; blogs=b; return {products,blogs};
}

function renderHome(){
  const grid=qs('#home-products'); if(grid) grid.innerHTML=products.slice(0,8).map(productCard).join('');
  qsa('[data-stat]').forEach(el=>{el.dataset.done=1;});
}

let shopState = {search:'',category:new URLSearchParams(location.search).get('category')||'All',sort:'default',page:1,show:8,view:'grid',maxPrice:15000000};
function renderShop(){
  const grid=qs('#shop-grid'); if(!grid)return;
  const categories=['All',...new Set(products.map(p=>p.category))];
  qs('#category-filters')&&(qs('#category-filters').innerHTML=categories.map(c=>`<button class="filter-chip ${shopState.category===c?'selected':''}" data-category="${c}">${c}</button>`).join(''));
  let data=products.filter(p=>shopState.category==='All'||p.category===shopState.category).filter(p=>p.price<=shopState.maxPrice).filter(p=>!shopState.search||`${p.name} ${p.description}`.toLowerCase().includes(shopState.search.toLowerCase()));
  if(shopState.sort==='price-asc')data.sort((a,b)=>a.price-b.price);if(shopState.sort==='price-desc')data.sort((a,b)=>b.price-a.price);if(shopState.sort==='name')data.sort((a,b)=>a.name.localeCompare(b.name));
  const total=data.length; const pages=Math.max(1,Math.ceil(total/shopState.show)); shopState.page=Math.min(shopState.page,pages);
  const start=(shopState.page-1)*shopState.show; const visible=data.slice(start,start+shopState.show);
  grid.className=shopState.view==='list'?'grid gap-5':'grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4';
  grid.innerHTML=visible.map(p=>shopState.view==='grid'?productCard(p):`<article class="flex gap-5 border-b border-black/10 pb-5"><img class="h-40 w-40 object-cover bg-[#F4F5F7]" src="${p.image}" alt="${p.name}"><div><a href="product.html?id=${p.id}" class="text-xl font-semibold">${p.name}</a><p class="mt-2 text-sm text-black/50">${p.description}</p><div class="mt-3 font-semibold">${money(p.price)}</div><div class="mt-4 flex flex-wrap gap-2"><button class="btn-outline" data-quick-add="${p.id}">Add to cart</button><button class="btn-outline" data-compare="${p.id}">Compare</button></div></div></article>`).join('');
  qs('#results-label')&&(qs('#results-label').textContent=`Showing ${total?start+1:0}–${Math.min(start+visible.length,total)} of ${total} results`);
  const pag=qs('#pagination'); if(pag)pag.innerHTML=Array.from({length:pages},(_,i)=>`<button class="page-btn ${shopState.page===i+1?'selected':''}" data-page="${i+1}">${i+1}</button>`).join('');
}

function renderProduct(){
  const id=Number(new URLSearchParams(location.search).get('id')||1); const p=products.find(x=>x.id===id)||products[0]; if(!p)return;
  const root=qs('#product-detail'); root.dataset.id=p.id;
  root.innerHTML=`<div class="grid gap-12 lg:grid-cols-[1.08fr_.92fr]"><div><div class="overflow-hidden rounded bg-[#F4F5F7]"><img id="main-product-image" class="w-full aspect-square object-cover" src="${p.gallery[0]}" alt="${p.name}"></div><div class="mt-4 grid grid-cols-4 gap-3">${p.gallery.map((img,i)=>`<button class="overflow-hidden rounded border ${i===0?'border-[#B88E2F]':'border-transparent'}" data-gallery="${img}"><img class="aspect-square w-full object-cover" src="${img}" alt=""></button>`).join('')}</div></div><div><div class="text-xs uppercase tracking-[.2em] text-black/40">Furniro collection</div><h1 class="mt-3 text-4xl font-semibold tracking-tight">${p.name}</h1><p class="mt-3 text-2xl font-semibold">${money(p.price)}</p><p class="mt-6 max-w-[540px] text-sm leading-7 text-black/55">${p.description}. A carefully proportioned piece with a soft, timeless silhouette designed for modern interiors.</p><div class="mt-8"><div class="text-sm font-medium">Size</div><div class="mt-3 flex flex-wrap gap-2" id="sizes">${p.sizes.map((s,i)=>`<button class="option-btn ${i===0?'selected':''}" data-size="${s}">${s}</button>`).join('')}</div></div><div class="mt-7"><div class="text-sm font-medium">Color</div><div class="mt-3 flex flex-wrap gap-2" id="colors">${p.colors.map((c,i)=>`<button class="option-btn ${i===0?'selected':''}" data-color="${c}">${c}</button>`).join('')}</div></div><div class="mt-8 flex flex-wrap gap-3"><div class="qty-box"><button data-product-qty="-1">−</button><span id="product-qty">1</span><button data-product-qty="1">+</button></div><button id="product-add" class="btn-primary">Add to cart</button><button data-compare="${p.id}" class="btn-outline">Compare</button></div><div class="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-5 text-sm"><div><span class="text-black/40">SKU</span><div class="mt-1">FNR-${String(p.id).padStart(3,'0')}</div></div><div><span class="text-black/40">Tags</span><div class="mt-1">Chair, Home, ${p.category}</div></div></div></div></div><div class="mt-16 border-t border-black/10 pt-10"><div class="flex flex-wrap gap-8 border-b border-black/10"><button class="tab-link active" data-tab="description">Description</button><button class="tab-link" data-tab="additional">Additional Information</button><button class="tab-link" data-tab="reviews">Reviews [5]</button></div><div class="pt-7"><div data-tab-panel="description" class="tab-panel">We make furniture that feels calm, practical and beautifully considered. The piece is designed to sit comfortably inside a collected home without dominating it.</div><div data-tab-panel="additional" class="tab-panel hidden">General: premium finish · Dimensions: 180 × 80 × 75 cm · Warranty: 2 years limited.</div><div data-tab-panel="reviews" class="tab-panel hidden">★★★★★ — “Beautiful finish and surprisingly comfortable.”<br><br>★★★★★ — “Looks exactly like the photos.”</div></div></div>`;
  setJSON(STORE.recent,[p.id,...getJSON(STORE.recent,[])].filter((v,i,a)=>a.indexOf(v)===i).slice(0,5));
  let qty=1; let size=p.sizes[0], color=p.colors[0];
  qsa('[data-size]',root).forEach(b=>b.addEventListener('click',()=>{size=b.dataset.size;qsa('[data-size]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
  qsa('[data-color]',root).forEach(b=>b.addEventListener('click',()=>{color=b.dataset.color;qsa('[data-color]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
  qsa('[data-gallery]',root).forEach(b=>b.addEventListener('click',()=>{qs('#main-product-image').src=b.dataset.gallery;qsa('[data-gallery]',root).forEach(x=>x.classList.remove('border-[#B88E2F]'));b.classList.add('border-[#B88E2F]');}));
  qsa('[data-product-qty]',root).forEach(b=>b.addEventListener('click',()=>{qty=Math.max(1,qty+Number(b.dataset.productQty));qs('#product-qty').textContent=qty;}));
  qs('#product-add',root)?.addEventListener('click',()=>addToCart(p,qty,size,color));
}

function renderCompare(){
  const ids=getJSON(STORE.compare,[]); const items=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean); const root=qs('#compare-root'); if(!root)return;
  const rows=[['General','Category',...items.map(x=>x.category)],['General','Brand',...items.map(x=>x.brand)],['Dimensions','Size',...items.map(x=>x.sizes.join(' · '))],['Dimensions','Color options',...items.map(x=>x.colors.join(' · '))],['Warranty','Warranty',...items.map(()=> '2 years')],['Warranty','Price',...items.map(x=>money(x.price))]];
  root.innerHTML=items.length?`<div class="overflow-x-auto"><table class="min-w-[860px] w-full border-collapse"><thead><tr><th class="w-[180px] bg-[#F9F1E7] p-4 text-left">Specification</th>${items.map(p=>`<th class="min-w-[220px] p-4 align-top"><img class="aspect-square w-full object-cover bg-[#F4F5F7]" src="${p.image}" alt="${p.name}"><div class="mt-3 text-lg font-semibold">${p.name}</div><button class="mt-2 text-xs text-red-600" data-remove-compare="${p.id}">Remove</button></th>`).join('')}</tr></thead><tbody>${rows.map((row,ri)=>{const vals=row.slice(2);const diff=new Set(vals).size>1;return `<tr class="border-t"><td class="bg-[#F9F1E7] p-4 font-medium">${row[1]}</td>${vals.map(v=>`<td class="p-4 text-center ${diff?'bg-[#FFF8E9]':''} ${ri===5?'font-semibold':''}">${v}${diff?'<span class="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#B88E2F]" title="Different"></span>':''}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>`:`<div class="py-24 text-center"><div class="text-4xl">♡</div><h2 class="mt-3 text-2xl font-semibold">Nothing to compare yet</h2><p class="mt-2 text-black/50">Add products from the shop or detail page.</p><a class="mt-6 inline-flex btn-primary" href="shop.html">Browse products</a></div>`;
}

function renderCartPage(){
 const root=qs('#cart-page'); if(!root)return; const cart=getCart(); const subtotal=cartSubtotal(); const ship=shippingCost(subtotal);
 root.innerHTML=`<div class="grid gap-10 lg:grid-cols-[1.55fr_.85fr]"><div>${cart.length?`<div class="hidden grid-cols-[1.8fr_.55fr_.7fr_.2fr] gap-4 bg-[#F9F1E7] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-black/50 md:grid"><div>Product</div><div>Price</div><div>Quantity</div><div></div></div><div class="divide-y divide-black/10">${cart.map(i=>`<div class="grid gap-4 py-5 md:grid-cols-[1.8fr_.55fr_.7fr_.2fr] md:items-center"><div class="flex items-center gap-4"><img class="h-20 w-20 object-cover bg-[#F4F5F7]" src="${i.image}" alt="${i.name}"><div><div class="font-semibold">${i.name}</div><div class="mt-1 text-xs text-black/45">${i.color} · ${i.size}</div></div></div><div class="text-sm">${money(i.price)}</div><div class="qty-box w-fit"><button data-cart-delta="${i.key}" data-delta="-1">−</button><span>${i.qty}</span><button data-cart-delta="${i.key}" data-delta="1">+</button></div><button data-remove-cart="${i.key}" class="text-xs text-red-600 md:text-right">Remove</button></div>`).join('')}</div>`:`<div class="py-20 text-center"><h2 class="text-2xl font-semibold">Your cart is empty</h2><a href="shop.html" class="mt-5 inline-flex btn-primary">Shop now</a></div>`}</div><aside class="h-fit bg-[#F9F1E7] p-7"><h2 class="text-2xl font-semibold">Cart Totals</h2><div class="mt-8 grid gap-4 text-sm"><div class="flex justify-between"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="flex justify-between"><span>Shipping</span><strong>${ship?money(ship):'Free'}</strong></div><div class="border-t border-black/10 pt-4 text-lg flex justify-between"><span>Total</span><strong class="text-[#B88E2F]">${money(subtotal+ship)}</strong></div></div><a href="checkout.html" class="mt-7 btn-primary w-full text-center ${cart.length?'':'pointer-events-none opacity-40'}">Proceed to Checkout</a></aside></div>`;
}

function renderCheckout(){
 const root=qs('#checkout-root'); if(!root)return; const saved=getJSON(STORE.shipping,{}); const cart=getCart(); const subtotal=cartSubtotal(); const ship=shippingCost(subtotal); 
 root.innerHTML=`<div class="grid gap-10 lg:grid-cols-[1.25fr_.75fr]"><form class="grid gap-5" id="checkout-form" novalidate><div class="form-section"><h2 class="text-2xl font-semibold">Contact</h2><div class="mt-6 grid gap-4 md:grid-cols-2"><label class="form-label">First name<input class="form-input" name="firstName" value="${saved.firstName||''}" required></label><label class="form-label">Last name<input class="form-input" name="lastName" value="${saved.lastName||''}" required></label><label class="form-label md:col-span-2">Email address<input class="form-input" name="email" type="email" value="${saved.email||''}" required></label><label class="form-label md:col-span-2">Phone<input class="form-input" name="phone" value="${saved.phone||''}" pattern="[0-9+() -]{8,}" required></label></div></div><div class="form-section"><h2 class="text-2xl font-semibold">Delivery</h2><div class="mt-6 grid gap-4 md:grid-cols-2"><label class="form-label md:col-span-2">Address<input class="form-input" name="address" value="${saved.address||''}" required></label><label class="form-label">Country / Region<select class="form-input" name="country" required><option value="">Select country</option><option ${saved.country==='Vietnam'?'selected':''}>Vietnam</option><option ${saved.country==='Singapore'?'selected':''}>Singapore</option><option ${saved.country==='Thailand'?'selected':''}>Thailand</option></select></label><label class="form-label">Province<select class="form-input" name="province" required><option value="">Select province</option><option ${saved.province==='HCMC'?'selected':''}>HCMC</option><option ${saved.province==='Ha Noi'?'selected':''}>Ha Noi</option><option ${saved.province==='Da Nang'?'selected':''}>Da Nang</option></select></label><label class="form-label">City<input class="form-input" name="city" value="${saved.city||''}" required></label><label class="form-label">Postal code<input class="form-input" name="postal" value="${saved.postal||''}" required></label><label class="md:col-span-2 flex items-center gap-3 text-sm"><input type="checkbox" id="same-address"> Same as shipping address</label></div></div><div class="form-section"><h2 class="text-2xl font-semibold">Payment</h2><div class="mt-6 grid gap-3"><label class="radio-card"><input type="radio" name="payment" value="bank" checked> <span>Direct Bank Transfer</span></label><label class="radio-card"><input type="radio" name="payment" value="cash"> <span>Cash on Delivery</span></label></div></div><label class="flex items-start gap-3 text-sm"><input type="checkbox" name="saveInfo" checked> Save this information for future</label><button class="btn-primary w-full md:w-fit" type="submit">Place order</button><p id="checkout-message" class="hidden rounded bg-emerald-50 p-3 text-sm text-emerald-700"></p></form><aside class="h-fit bg-[#F9F1E7] p-7 lg:sticky lg:top-28"><h2 class="text-2xl font-semibold">Your order</h2><div class="mt-6 divide-y divide-black/10">${cart.map(i=>`<div class="flex gap-3 py-4"><img class="h-14 w-14 object-cover bg-white" src="${i.image}" alt=""><div class="min-w-0 flex-1"><div class="font-medium">${i.name}</div><div class="text-xs text-black/45">${i.color} · ${i.size} × ${i.qty}</div></div><strong class="text-sm">${money(i.price*i.qty)}</strong></div>`).join('')}</div><div class="mt-5 space-y-3 border-t border-black/10 pt-5 text-sm"><div class="flex justify-between"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="flex justify-between"><span>Shipping</span><strong>${ship?money(ship):'Free'}</strong></div><div class="flex justify-between pt-2 text-lg"><span>Total</span><strong class="text-[#B88E2F]">${money(subtotal+ship)}</strong></div></div><div class="mt-6 flex gap-2"><input id="discount-code" class="form-input min-w-0 flex-1" placeholder="Discount code"><button id="apply-discount" type="button" class="btn-outline">Apply</button></div><p id="discount-note" class="mt-2 text-xs text-black/45">Try FURNIRO10 for 10% off.</p></aside></div>`;
}

function renderBlog(){
 const list=qs('#blog-list'); if(!list)return; let data=[...blogs]; const cat=qs('#blog-filter')?.value||'All'; const s=qs('#blog-search')?.value.trim().toLowerCase()||''; if(cat!=='All')data=data.filter(b=>b.category===cat); if(s)data=data.filter(b=>(b.title+' '+b.excerpt).toLowerCase().includes(s)); list.innerHTML=data.map(b=>`<article class="overflow-hidden rounded-xl border border-black/5 bg-white"><img loading="lazy" src="${b.image}" alt="${b.title}" class="aspect-[4/3] w-full object-cover"><div class="p-5"><div class="text-xs uppercase tracking-[.18em] text-black/40">${b.category} · ${b.date}</div><h2 class="mt-3 text-xl font-semibold">${b.title}</h2><p class="mt-2 text-sm leading-6 text-black/55">${b.excerpt}</p><a href="blog.html?post=${b.id}" class="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Read article</a></div></article>`).join('');
}

function renderBlogDetail(){
 const post=blogs.find(b=>b.id===Number(new URLSearchParams(location.search).get('post'))) || blogs[0]; const root=qs('#blog-detail'); if(!root)return; root.innerHTML=`<article class="mx-auto max-w-[860px]"><img src="${post.image}" alt="${post.title}" class="aspect-[16/8] w-full object-cover"><div class="mt-8 text-xs uppercase tracking-[.18em] text-black/40">${post.category} · ${post.date}</div><h1 class="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">${post.title}</h1><p class="mt-6 text-lg leading-8 text-black/55">${post.excerpt} This long-form note explores how proportion, texture and negative space work together in a considered interior.</p><div class="prose mt-10 max-w-none text-black/75"><p>Furniture becomes more useful when it works with the way people actually live. Start with the largest shapes, then soften the room through natural materials and smaller objects.</p><p>Keep a visual rhythm between heights and textures. A calm palette allows one or two hero pieces to become memorable without making the whole room feel busy.</p><blockquote>“The best rooms feel collected, not crowded.”</blockquote><p>At Furniro, every collection is imagined with that idea in mind: fewer, better pieces with enough flexibility to evolve over time.</p></div><button class="mt-8 btn-outline" data-share="blog:${post.id}">Share article</button></article>`;
}

function renderContact(){
 const form=qs('#contact-form'); if(!form)return; form.addEventListener('submit',e=>{e.preventDefault(); const message=qs('#contact-success'); if(form.checkValidity()){message.textContent='Thanks — your message has been sent.';message.classList.remove('hidden');form.reset();}else{message.textContent='Please complete the highlighted fields.';message.className='rounded bg-red-50 p-3 text-sm text-red-700';message.classList.remove('hidden');form.reportValidity();}})
}

function bindGlobal(){
 document.addEventListener('click',e=>{
   const a=e.target.closest('[data-action]'); if(a){const ac=a.dataset.action; if(ac==='cart')openCart(); if(ac==='close-cart')closeCart(); if(ac==='search')openSearch(); if(ac==='close-search')closeSearch(); if(ac==='account')openAccount(); if(ac==='close-account')closeAccount(); if(ac==='mobile-menu')qs('#mobile-menu')?.classList.toggle('hidden');}
   const q=e.target.closest('[data-quick-add]'); if(q){const p=products.find(x=>x.id===Number(q.dataset.quickAdd)); if(p)addToCart(p,1,p.sizes[0],p.colors[0]);}
   const c=e.target.closest('[data-compare]'); if(c){const id=Number(c.dataset.compare); const ids=getJSON(STORE.compare,[]); const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id].slice(-3); setJSON(STORE.compare,next); if(pageName==='compare')renderCompare();}
   const rd=e.target.closest('[data-remove-cart]'); if(rd){removeCartItem(rd.dataset.removeCart);}
   const cd=e.target.closest('[data-cart-delta]'); if(cd){updateCartItem(cd.dataset.cartDelta,Number(cd.dataset.delta));}
   const rc=e.target.closest('[data-remove-compare]'); if(rc){setJSON(STORE.compare,getJSON(STORE.compare,[]).filter(x=>x!==Number(rc.dataset.removeCompare)));renderCompare();}
   const pbtn=e.target.closest('[data-page]'); if(pbtn){shopState.page=Number(pbtn.dataset.page);renderShop();}
   const cat=e.target.closest('[data-category]'); if(cat){shopState.category=cat.dataset.category;shopState.page=1;renderShop();}
   const tab=e.target.closest('[data-tab]'); if(tab){const root=tab.closest('#product-detail'); if(root){qsa('.tab-link',root).forEach(x=>x.classList.remove('active'));tab.classList.add('active');qsa('[data-tab-panel]',root).forEach(x=>x.classList.toggle('hidden',x.dataset.tabPanel!==tab.dataset.tab));}}
   const share=e.target.closest('[data-share]'); if(share){navigator.clipboard?.writeText(location.href).then(()=>{share.textContent='Copied';setTimeout(()=>share.textContent='Share article',1400);});}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeSearch();closeAccount();}});
 qs('#cart-overlay')?.addEventListener('click',closeCart);
 qs('#global-search')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase(); const list=products.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q)).slice(0,5); qs('#search-results').innerHTML=q?list.map(p=>`<a href="product.html?id=${p.id}" class="flex items-center gap-4 rounded-lg p-2 hover:bg-black/5"><img src="${p.image}" class="h-12 w-12 object-cover" alt=""><div><div class="font-semibold">${p.name}</div><div class="text-xs text-black/45">${money(p.price)}</div></div></a>`).join(''):'<div class="py-8 text-sm text-black/40">Start typing to search the collection.</div>';});
 qsa('[data-form="subscribe"]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const p=f.querySelector('input');const err=qs('[data-error="subscribe"]');if(p.checkValidity()){err.textContent='Subscribed — welcome to Furniro.';err.className='mt-2 text-xs text-emerald-600';f.reset();}else{err.textContent='Please enter a valid email.';err.className='mt-2 text-xs text-red-600';}}));
 qsa('[data-form="login"]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const err=qs('[data-error="login"]');if(f.checkValidity()){err.textContent='Demo login successful.';err.className='text-xs text-emerald-600';setTimeout(closeAccount,700);}else{err.textContent='Please check your email and password.';err.className='text-xs text-red-600';f.reportValidity();}}));
}

function bindShopControls(){
 qs('#shop-search')?.addEventListener('input',e=>{shopState.search=e.target.value;shopState.page=1;renderShop();});
 qs('#shop-sort')?.addEventListener('change',e=>{shopState.sort=e.target.value;shopState.page=1;renderShop();});
 qs('#shop-show')?.addEventListener('change',e=>{shopState.show=Number(e.target.value);shopState.page=1;renderShop();});
 qs('#shop-max-price')?.addEventListener('input',e=>{shopState.maxPrice=Number(e.target.value);qs('#shop-max-label').textContent=money(shopState.maxPrice);shopState.page=1;renderShop();});
 qs('#view-grid')?.addEventListener('click',()=>{shopState.view='grid';renderShop();}); qs('#view-list')?.addEventListener('click',()=>{shopState.view='list';renderShop();});
 qs('#filter-open')?.addEventListener('click',()=>qs('#shop-filters')?.classList.toggle('hidden'));
}

function bindCheckout(){
 qs('#checkout-form')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const msg=qs('#checkout-message');if(form.checkValidity()){if(qs('input[name="saveInfo"]')?.checked){setJSON(STORE.shipping,Object.fromEntries(new FormData(form).entries()));}msg.textContent='Order placed successfully. This demo stops before real payment.';msg.classList.remove('hidden');setJSON(STORE.cart,[]);updateCartBadge();renderDrawer();}else form.reportValidity();});
 qs('#same-address')?.addEventListener('change',()=>{if(qs('#same-address').checked){['city','postal'].forEach(n=>{const i=qs(`[name="${n}"]`);if(i) i.value=savedValue(n);});}});
 function savedValue(n){return getJSON(STORE.shipping,{})[n]||'';}
 qs('#apply-discount')?.addEventListener('click',()=>{const code=qs('#discount-code').value.trim().toUpperCase();const note=qs('#discount-note');note.textContent=code==='FURNIRO10'?'10% discount applied to your order.':'Invalid code. Try FURNIRO10.';note.className=code==='FURNIRO10'?'mt-2 text-xs text-emerald-600':'mt-2 text-xs text-red-600';});
}

(async()=>{
  injectShell(); bindGlobal();
  try { await loadData(); } catch(e){ console.error(e); return; }
  if(pageName==='home'){renderHome();}
  if(pageName==='shop'){renderShop();bindShopControls();}
  if(pageName==='product'){renderProduct();}
  if(pageName==='compare'){renderCompare();}
  if(pageName==='cart'){renderCartPage();}
  if(pageName==='checkout'){renderCheckout();bindCheckout();}
  if(pageName==='blog'){ if(new URLSearchParams(location.search).has('post')) renderBlogDetail(); else {renderBlog();qs('#blog-search')?.addEventListener('input',renderBlog);qs('#blog-filter')?.addEventListener('change',renderBlog);} }
  if(pageName==='contact'){renderContact();}
})();
