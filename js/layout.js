const money = n => n.toLocaleString("vi-VN") + " ₫";
const $ = selector => document.querySelector(selector);

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
};

let cart = store.get("mv_cart", {});
let wish = store.get("mv_wish", [1, 3]);
let couponPercent = 0;

const SVG = (inner) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICON = {
  user: SVG('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  cart: SVG('<path d="M3 4h2l2.5 11h10l2-8H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>')
};

const NAV = [
  ["index.html", "Trang chủ", "home"],
  ["danh-muc.html", "Danh mục linh kiện", "catalog"],
  ["datasheet.html", "Datasheet & Tài liệu", "datasheet"],
  ["combo.html", "Khuyến mãi / Combo", "combo"],
  ["blog.html", "Blog / Hướng dẫn", "blog"],
  ["ho-tro.html", "Hỗ trợ & Liên hệ", "support"]
];

const INFO = {
  bh: ["Quy định bảo hành", "Bảo hành 7 ngày với hàng lỗi do nhà sản xuất. Không bảo hành linh kiện cháy nổ do đấu sai mạch."],
  dt: ["Chính sách đổi trả", "Đổi trả trong 7 ngày nếu sản phẩm còn nguyên tem và chưa hàn. Hoàn tiền trong 3 ngày làm việc."],
  hoatoc: ["Giao hàng hỏa tốc", "Nội thành TP.HCM và Hà Nội giao trong 4 giờ, phí 60.000 ₫, đặt trước 16:00."],
  mua: ["Hướng dẫn mua hàng", "Chọn linh kiện, thêm vào giỏ, nhập mã giảm giá, chọn cách giao rồi thanh toán."],
  tt: ["Hướng dẫn thanh toán", "Hỗ trợ chuyển khoản, COD khi nhận hàng và ví VNPAY/MoMo qua mã QR."]
};


function chipSvg(color) {
  const pins = [24, 34, 44, 54]
    .map(y => `<path d="M12 ${y}h8M60 ${y}h8" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`)
    .join("");
  return `<svg viewBox="0 0 80 80" aria-hidden="true">
    <rect x="20" y="16" width="40" height="48" rx="4" fill="#fff" stroke="${color}" stroke-width="3"/>
    ${pins}<circle cx="30" cy="26" r="3" fill="${color}"/></svg>`;
}

function buildHeader() {
  const page = document.body.dataset.page;
  const q = new URLSearchParams(location.search).get("q") || "";
  $("#site-header").className = "site-header";
  $("#site-header").innerHTML = `
    <div class="rgb-line"></div>
    <div class="topbar"><div class="container">
      <span>Hotline tư vấn kỹ thuật: 0900 123 456</span>
      <span>Freeship đơn từ 500.000 ₫ · Giao hỏa tốc 4 giờ</span>
    </div></div>
    <div class="container mainbar">
      <a class="logo" href="index.html">MạchViệt</a>
      <form class="search" action="danh-muc.html">
        <input name="q" value="${q}" placeholder="Tìm: ATmega328P, NE555, Tụ 10uF 50V, Resistor 10k 1/4W" aria-label="Tìm kiếm">
        <button type="submit">Tìm</button>
      </form>
      <div class="header-actions">
        <a class="action-btn" href="tai-khoan.html">${ICON.user}<span>Tài khoản</span></a>
        <button class="action-btn cart-btn" data-act="cart">${ICON.cart}<span>Giỏ hàng</span><b id="cart-count">0</b></button>
      </div>
    </div>
    <div class="container"><nav class="main-nav">
      ${NAV.map(n => `<a href="${n[0]}" class="${n[2] === page ? "active" : ""}">${n[1]}</a>`).join("")}
    </nav></div>`;
}

function buildFooter() {
  $("#site-footer").className = "site-footer";
  $("#site-footer").innerHTML = `
    <div class="newsletter"><div class="container">
      <div><h3>Nhận ưu đãi và bài hướng dẫn mới</h3><p>Mỗi tuần một email, không spam.</p></div>
      <form onsubmit="event.preventDefault(); toast('Cảm ơn bạn đã đăng ký (demo)')">
        <input type="email" placeholder="Email của bạn" aria-label="Email"><button type="submit">Đăng ký</button>
      </form>
    </div></div>
    <div class="container footer-grid">
      <div><h3>MạchViệt</h3>
        <p class="muted">Linh kiện điện tử cho sinh viên, kỹ sư và người làm dự án.</p>
        <p class="muted">12 Nguyễn Văn Linh, Quận 7, TP.HCM<br>Hotline: 0900 123 456</p></div>
      <div><h3>Chính sách cửa hàng</h3>
        <button data-act="info" data-k="bh">Quy định bảo hành</button>
        <button data-act="info" data-k="dt">Chính sách đổi trả</button>
        <button data-act="info" data-k="hoatoc">Giao hàng hỏa tốc</button></div>
      <div><h3>Hướng dẫn</h3>
        <button data-act="info" data-k="mua">Hướng dẫn mua hàng</button>
        <button data-act="info" data-k="tt">Hướng dẫn thanh toán</button></div>
      <div><h3>Thanh toán</h3>
        <div class="pay"><span>Chuyển khoản</span><span>COD</span><span>VNPAY</span><span>MoMo</span></div></div>
    </div>
    <div class="copyright">© 2026 MạchViệt – Trang demo môn Thiết kế web. Dữ liệu là dữ liệu mẫu.</div>`;
}

function buildDrawer() {
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="drawer" id="drawer" aria-label="Giỏ hàng">
      <div class="drawer-head"><h2>Giỏ hàng</h2><button class="action-btn" data-act="cart">Đóng</button></div>
      <div class="drawer-lines" id="cart-lines"></div>
      <div class="coupon-row"><input id="coupon" placeholder="Mã giảm giá (thử SV10)"><button class="action-btn" data-act="coupon">Áp dụng</button></div>
      <select id="ship">
        <option value="25000">Giao tiêu chuẩn (2–3 ngày) – 25.000 ₫</option>
        <option value="40000">Giao tỉnh (3–5 ngày) – 40.000 ₫</option>
        <option value="60000">Hỏa tốc (4 giờ) – 60.000 ₫</option>
      </select>
      <div id="cart-sum"></div>
      <button class="btn" data-act="demo">Thanh toán</button>
    </aside>
    <div id="toast" role="status"></div>
    <dialog id="dlg"><h3 id="dlg-title"></h3><p class="muted" id="dlg-body"></p><button class="btn" onclick="this.closest('dialog').close()">Đã hiểu</button></dialog>`);
  $("#ship").onchange = renderCart;
}

function renderCart() {
  const ids = Object.keys(cart);
  let subtotal = 0, count = 0;
  $("#cart-lines").innerHTML = ids.length
    ? ids.map(i => {
        const qty = cart[i];
        subtotal += PRODUCTS[i].price * qty;
        count += qty;
        return `<div class="cart-line">
          <span>${PRODUCTS[i].name}<br><small class="muted">${money(PRODUCTS[i].price)}</small></span>
          <span class="qty"><button data-act="dec" data-id="${i}">−</button> ${qty} <button data-act="add" data-id="${i}">+</button></span>
        </div>`;
      }).join("")
    : '<p class="muted">Giỏ hàng đang trống.</p>';

  const discount = Math.round(subtotal * couponPercent / 100);
  const standard = $("#ship").selectedIndex === 0;
  const shipping = !subtotal ? 0 : (standard && subtotal >= 500000 ? 0 : +$("#ship").value);
  $("#cart-sum").innerHTML = `
    <div class="total-row"><span>Tạm tính</span><span>${money(subtotal)}</span></div>
    <div class="total-row"><span>Giảm giá</span><span>-${money(discount)}</span></div>
    <div class="total-row"><span>Vận chuyển dự kiến</span><span>${money(shipping)}</span></div>
    <div class="total-row big"><span>Tổng cộng</span><span>${money(subtotal - discount + shipping)}</span></div>`;
  $("#cart-count").textContent = count;
  store.set("mv_cart", cart);
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el.timer);
  el.timer = setTimeout(() => el.classList.remove("show"), 1800);
}


document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  const id = +el.dataset.id;

  if (act === "cart") $("#drawer").classList.toggle("open");
  else if (act === "add") { cart[id] = (cart[id] || 0) + 1; renderCart(); toast("Đã thêm vào giỏ hàng"); }
  else if (act === "dec") { if (--cart[id] <= 0) delete cart[id]; renderCart(); }
  else if (act === "wish") {
    wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
    store.set("mv_wish", wish);
    toast("Đã cập nhật danh sách BoM");
    if (typeof renderPage === "function") renderPage();
  }
  else if (act === "coupon") {
    couponPercent = $("#coupon").value.trim().toUpperCase() === "SV10" ? 10 : 0;
    renderCart();
    toast(couponPercent ? "Đã áp dụng giảm 10%" : "Mã không hợp lệ");
  }
  else if (act === "info") {
    $("#dlg-title").textContent = INFO[el.dataset.k][0];
    $("#dlg-body").textContent = INFO[el.dataset.k][1];
    $("#dlg").showModal();
  }
  else if (act === "demo") toast("Chức năng minh họa của trang demo");
});

buildHeader();
buildFooter();
buildDrawer();
renderCart();

document.body.insertAdjacentHTML("beforeend", '<button id="to-top" aria-label="Lên đầu trang">↑</button>');
$("#to-top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
addEventListener("scroll", () => $("#to-top").classList.toggle("show", scrollY > 600));

function imgFallback(img) {
  img.outerHTML = chipSvg(img.dataset.color);
}
