const params = new URLSearchParams(location.search);
const pageName = document.body.dataset.page;

const oldPriceOf = p => /hot|new/.test(p.tag) ? Math.round(p.price * 1.18 / 1000) * 1000 : 0;
const ratingOf = i => (4.3 + (i % 7) / 10).toFixed(1);
const soldOf = i => 20 + (i * 37) % 180;

function priceRow(p) {
  const old = oldPriceOf(p);
  return `<div class="price-row"><span class="price">${money(p.price)}</span>` +
    (old ? `<s class="old">${money(old)}</s><span class="off">-${Math.round((1 - p.price / old) * 100)}%</span>` : "") + `</div>`;
}

function productImg(p, color) {
  return p.img
    ? `<img src="${p.img}" alt="${p.name}" data-color="${color}" loading="lazy" onerror="imgFallback(this)">`
    : chipSvg(color);
}

function card(i) {
  const p = PRODUCTS[i];
  const color = CATS[p.cat].color;
  const badge = p.tag.includes("new") ? "Mới" : p.tag.includes("hot") ? "Hot" : "";
  const link = `san-pham.html?id=${i}`;
  return `
    <article class="card" style="--c:${color}">
      <a class="card-pic" href="${link}">
        <span class="card-part">${p.part}</span>
        ${badge ? `<span class="badge">${badge}</span>` : ""}
        ${productImg(p, color)}
      </a>
      <div class="card-body">
        <small>${p.sub}</small>
        <h3><a href="${link}">${p.name}</a></h3>
        <small>${p.spec}</small>
        <div class="rating">★★★★★ <span>${ratingOf(i)} · Đã bán ${soldOf(i)}</span></div>
        ${priceRow(p)}
        <div class="card-actions">
          <button class="add" data-act="add" data-id="${i}">Thêm vào giỏ</button>
          <button class="wish" data-act="wish" data-id="${i}" aria-label="Lưu vào BoM">${wish.includes(i) ? "♥" : "♡"}</button>
        </div>
      </div>
    </article>`;
}

const idsWhere = test => PRODUCTS.map((p, i) => i).filter(i => test(PRODUCTS[i]));
const cards = ids => ids.map(card).join("");

const pages = {
  home() {
    $("#mega").innerHTML = CATS.map((c, i) => `
      <li style="--c:${c.color}"><a href="danh-muc.html?cat=${i}">${c.name}</a>
        <div class="flyout">${c.subs.map(s => `<a href="danh-muc.html?cat=${i}&sub=${encodeURIComponent(s)}">${s}</a>`).join("")}</div>
      </li>`).join("");
    $("#tiles").innerHTML = CATS.map((c, i) => `
      <a class="tile" style="--c:${c.color}" href="danh-muc.html?cat=${i}">
        <h3>${c.name}</h3><small class="muted">${c.subs.slice(0, 3).join(", ")}...</small></a>`).join("");
    $("#new-grid").innerHTML = cards(idsWhere(p => p.tag.includes("new")).slice(0, 4));
    $("#kit-grid").innerHTML = cards(idsWhere(p => p.tag.includes("kit")));
    $("#flash-grid").innerHTML = cards(idsWhere(p => p.tag.includes("hot")));
  },

  catalog() {
    const q = (params.get("q") || "").toLowerCase().split(/\s+/).filter(Boolean);
    const cat = params.has("cat") ? +params.get("cat") : null;
    const sub = params.get("sub");
    const ids = idsWhere(p =>
      (cat === null || p.cat === cat) &&
      (!sub || p.sub === sub) &&
      q.every(k => (p.name + p.sub + p.part + p.spec).toLowerCase().includes(k)));

    $("#side").innerHTML =
      `<a href="danh-muc.html" class="${cat === null ? "on" : ""}">Tất cả sản phẩm</a>` +
      CATS.map((c, i) => `<b>${c.name}</b>` + c.subs.map(s =>
        `<a href="danh-muc.html?cat=${i}&sub=${encodeURIComponent(s)}" class="${sub === s ? "on" : ""}">${s}</a>`).join("")).join("");
    $("#count").textContent = `${ids.length} sản phẩm` + (params.get("q") ? ` cho "${params.get("q")}"` : "");
    $("#list").innerHTML = ids.length ? cards(ids) : "<p>Không tìm thấy. Thử mã part khác, ví dụ NE555.</p>";
  },

  datasheet() {
    const keyword = $("#ds-search").value.toLowerCase();
    const ids = idsWhere(p => p.cat < 3 && (p.name + p.part).toLowerCase().includes(keyword));
    $("#ds-list").innerHTML = ids.map(i => `
      <div class="list-row">
        <div><b>${PRODUCTS[i].part}</b><br><small class="muted">${PRODUCTS[i].name}</small></div>
        <div>${["Datasheet PDF", "Pinout", "Sơ đồ nguyên lý"].map(t => `<button class="doc-chip" data-act="demo">${t}</button>`).join("")}</div>
      </div>`).join("");
  },

  combo() {
    $("#combo-list").innerHTML = COMBOS.map(c => `
      <div class="box">
        <h3>${c.name}</h3><p>${c.desc}</p>
        <p><span class="new-price">${money(c.price)}</span> <span class="old-price">${money(c.old)}</span></p>
        <p>Tiết kiệm ${money(c.old - c.price)}</p>
        <button class="btn" data-act="demo">Thêm combo</button>
      </div>`).join("");
  },

  blog() {
    $("#post-list").innerHTML = POSTS.map((p, i) => `
      <div class="box" style="border-top:4px solid ${CATS[i % 5].color}">
        <small class="muted">${p.tag}</small>
        <h3>${p.title}</h3><p>Hướng dẫn từng bước kèm sơ đồ và mã nguồn mẫu.</p>
        <button class="btn light" data-act="demo">Đọc bài</button>
      </div>`).join("");
  },

  product() {
    const id = PRODUCTS[+params.get("id")] ? +params.get("id") : 0;
    const p = PRODUCTS[id];
    const color = CATS[p.cat].color;
    document.title = p.name + " – MạchViệt";
    $("#detail").innerHTML = `
      <nav class="crumbs"><a href="index.html">Trang chủ</a> / <a href="danh-muc.html?cat=${p.cat}">${CATS[p.cat].name}</a> / ${p.name}</nav>
      <div class="detail">
        <div class="detail-pic" style="--c:${color}"><span class="card-part">${p.part}</span>${productImg(p, color)}</div>
        <div class="detail-info">
          <small class="muted">${p.sub}</small>
          <h1>${p.name}</h1>
          <div class="rating">★★★★★ <span>${ratingOf(id)} · Đã bán ${soldOf(id)}</span></div>
          ${priceRow(p)}
          <table class="spec">
            <tr><td>Mã part</td><td>${p.part}</td></tr>
            <tr><td>Nhóm sản phẩm</td><td>${CATS[p.cat].name}</td></tr>
            <tr><td>Thông số</td><td>${p.spec}</td></tr>
            <tr><td>Tình trạng</td><td>Còn hàng</td></tr>
            <tr><td>Bảo hành</td><td>7 ngày (lỗi do nhà sản xuất)</td></tr>
          </table>
          <div class="buy">
            <button class="btn" data-act="add" data-id="${id}">Thêm vào giỏ</button>
            <button class="btn light" data-act="wish" data-id="${id}">${wish.includes(id) ? "♥ Đã lưu BoM" : "♡ Lưu vào BoM"}</button>
            <a class="btn light" href="datasheet.html">Xem datasheet</a>
          </div>
        </div>
      </div>`;
    const related = idsWhere(q => q.cat === p.cat).filter(i => i !== id).slice(0, 4);
    $("#related").innerHTML = cards(related);
  },

  account() {
    const tab = pages.tab || "orders";
    const tabs = [["orders", "Quản lý đơn hàng"], ["bom", `Wishlist / BoM (${wish.length})`], ["address", "Sổ địa chỉ & VAT"]];
    const body = {
      orders: ORDERS.map(o => `
        <div class="box" style="margin-bottom:12px">
          <b>${o.id}</b> · ${o.date} · ${o.total}
          <p>Mã vận đơn ${o.track}: ${ORDER_STEPS[o.step - 1]}</p>
          <div class="progress">${ORDER_STEPS.map((s, i) => `<span class="${i < o.step ? "on" : ""}" title="${s}"></span>`).join("")}</div>
        </div>`).join(""),
      bom: wish.length ? wish.map(i => `
        <div class="list-row"><span><b>${PRODUCTS[i].part}</b> · ${PRODUCTS[i].name}</span>
          <span>${money(PRODUCTS[i].price)}
            <button class="doc-chip" data-act="add" data-id="${i}">Thêm vào giỏ</button>
            <button class="doc-chip" data-act="wish" data-id="${i}">Xóa</button></span></div>`).join("")
        : '<p class="muted">Chưa có linh kiện nào. Bấm ♡ ở sản phẩm để lưu.</p>',
      address: `<div class="two-col">
        <div class="box"><h3>Địa chỉ giao hàng</h3>
          <input class="field" value="Nguyễn Văn A – 0900 111 222">
          <input class="field" value="45 Lê Lợi, Quận 1, TP.HCM">
          <button class="btn light" data-act="demo">Lưu địa chỉ</button></div>
        <div class="box"><h3>Hóa đơn đỏ (VAT)</h3>
          <input class="field" placeholder="Tên công ty / trường học">
          <input class="field" placeholder="Mã số thuế">
          <button class="btn light" data-act="demo">Lưu thông tin VAT</button></div></div>`
    };
    $("#acc-tabs").innerHTML = tabs.map(t => `<button class="${t[0] === tab ? "on" : ""}" data-tab="${t[0]}">${t[1]}</button>`).join("");
    $("#acc-body").innerHTML = body[tab];
  }
};

function initSlider() {
  const track = $("#track");
  const dots = $("#dots");
  const total = track.children.length;
  let current = 0, timer;

  document.querySelectorAll(".slide-art").forEach(el => { el.innerHTML = chipSvg(el.dataset.color); });
  dots.innerHTML = [...track.children].map((s, i) => `<button data-go="${i}" aria-label="Slide ${i + 1}"></button>`).join("");

  function show(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dots.children].forEach((d, j) => d.classList.toggle("on", j === current));
  }
  function auto() {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show(current + 1), 4500);
  }

  $(".slider").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.go) show(+b.dataset.go);
    if (b.dataset.dir) show(current + +b.dataset.dir);
    auto();
  });
  show(0);
  auto();
}

function initCountdown() {
  const el = $("#cd");
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const end = new Date();
    end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - new Date()) / 1000));
    el.innerHTML = `<b>${pad(Math.floor(s / 3600))}</b>:<b>${pad(Math.floor(s % 3600 / 60))}</b>:<b>${pad(s % 60)}</b>`;
  }
  tick();
  setInterval(tick, 1000);
}

const revealer = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); }
    }), { threshold: .1 })
  : null;

function revealOnScroll() {
  if (!revealer) return;
  document.querySelectorAll(".card, .tile, .box, .perk, .list-row").forEach(el => {
    if (el.dataset.seen || el.getBoundingClientRect().top < innerHeight) return;
    el.dataset.seen = "1";
    el.classList.add("js-reveal");
    revealer.observe(el);
  });
}

function renderPage() {
  if (pages[pageName]) pages[pageName]();
  revealOnScroll();
}

renderPage();
if (pageName === "home") { initSlider(); initCountdown(); }
if (pageName === "datasheet") $("#ds-search").addEventListener("input", renderPage);
if (pageName === "account") {
  $("#acc-tabs").addEventListener("click", e => {
    if (e.target.dataset.tab) { pages.tab = e.target.dataset.tab; renderPage(); }
  });
}
