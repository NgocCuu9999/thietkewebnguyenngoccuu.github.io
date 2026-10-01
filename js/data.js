
const CATS = [
  { name: "Vi điều khiển & Module", color: "#2f6bff", subs: ["Arduino", "ESP32", "Raspberry Pi", "Cảm biến", "Module truyền thông"] },
  { name: "Linh kiện bán dẫn",      color: "#ff3b30", subs: ["IC", "Transistor", "Diode", "Mosfet", "Optocoupler"] },
  { name: "Linh kiện thụ động",     color: "#22c55e", subs: ["Điện trở", "Tụ điện", "Cuộn cảm", "Thạch anh"] },
  { name: "Nguồn & Pin",            color: "#f59e0b", subs: ["Adapter", "Mạch sạc", "Pin Lipo", "Buck/Boost"] },
  { name: "Dụng cụ & Phụ kiện",     color: "#8b5cf6", subs: ["Mỏ hàn", "Đồng hồ VOM", "Dây Breadboard", "PCB", "Kẹp"] }
];

const PRODUCTS = [
  { name: "Arduino Uno R3",       cat: 0, sub: "Arduino",             part: "ATmega328P",      spec: "ATmega328P 16MHz 14 chân số",   price: 145000, tag: "kit", img: "images/arduino-uno-r3.webp" },
  { name: "ESP32 DevKit V1",      cat: 0, sub: "ESP32",               part: "ESP32-WROOM-32",  spec: "Wi-Fi Bluetooth 240MHz",        price: 135000, tag: "new kit", img: "images/esp32-devkit-v1.jpg" },
  { name: "ESP32-CAM",            cat: 0, sub: "ESP32",               part: "ESP32-CAM",       spec: "Camera OV2640 Wi-Fi",           price: 165000, tag: "new kit", img: "images/esp32-cam.jpeg" },
  { name: "Raspberry Pi Pico",    cat: 0, sub: "Raspberry Pi",        part: "RP2040",          spec: "Lõi kép 133MHz",                price: 98000,  tag: "kit", img: "images/raspberry-pi-pico.webp" },
  { name: "Cảm biến DHT22",       cat: 0, sub: "Cảm biến",            part: "DHT22",           spec: "Nhiệt độ độ ẩm",                price: 89000,  tag: "", img: "images/cam-bien-dht22.webp" },
  { name: "Siêu âm HC-SR04",      cat: 0, sub: "Cảm biến",            part: "HC-SR04",         spec: "Đo khoảng cách 2-400cm",        price: 32000,  tag: "hot", img: "images/sieu-am-hc-sr04.jpg" },
  { name: "LoRa SX1278",          cat: 0, sub: "Module truyền thông", part: "SX1278",          spec: "LoRa 433MHz",                   price: 120000, tag: "new", img: "images/lora-sx1278.jpg" },
  { name: "IC định thời NE555",   cat: 1, sub: "IC",                  part: "NE555",           spec: "Timer IC DIP-8",                price: 5000,   tag: "hot", img: "images/ic-dinh-thoi-ne555.webp" },
  { name: "Transistor 2N2222",    cat: 1, sub: "Transistor",          part: "2N2222",          spec: "NPN 40V 800mA gói 20",          price: 15000,  tag: "", img: "images/transistor-2n2222.webp" },
  { name: "Diode 1N4007",         cat: 1, sub: "Diode",               part: "1N4007",          spec: "Diode 1A 1000V gói 50",         price: 20000,  tag: "", img: "images/diode-1n4007.jpg" },
  { name: "Mosfet IRF540N",       cat: 1, sub: "Mosfet",              part: "IRF540N",         spec: "N-MOSFET 100V 33A",             price: 18000,  tag: "new", img: "images/mosfet-irf540n.webp" },
  { name: "Optocoupler PC817",    cat: 1, sub: "Optocoupler",         part: "PC817",           spec: "Cách ly 4 chân gói 10",         price: 16000,  tag: "", img: "images/optocoupler-pc817.jpg" },
  { name: "Điện trở 10k",         cat: 2, sub: "Điện trở",            part: "R10K-1/4W",       spec: "Resistor 10k 1/4W 1% gói 100",  price: 12000,  tag: "hot", img: "images/dien-tro-10k.jpg" },
  { name: "Tụ hóa 10uF 50V",      cat: 2, sub: "Tụ điện",             part: "C10UF-50V",       spec: "Tụ 10uF 50V gói 20",            price: 14000,  tag: "", img: "images/tu-hoa-10uf-50v.jpeg" },
  { name: "Cuộn cảm 100uH",       cat: 2, sub: "Cuộn cảm",            part: "L100UH",          spec: "Inductor 100uH 1A",             price: 6000,   tag: "", img: "images/cuon-cam-100uh.jpg" },
  { name: "Thạch anh 16MHz",      cat: 2, sub: "Thạch anh",           part: "HC-49S-16M",      spec: "Crystal 16MHz",                 price: 4000,   tag: "", img: "images/thach-anh-16mhz.webp" },
  { name: "Adapter 12V 2A",       cat: 3, sub: "Adapter",             part: "AD-12V2A",        spec: "Nguồn 12V 2A jack DC",          price: 65000,  tag: "", img: "images/adapter-12v-2a.jpg" },
  { name: "Mạch sạc TP4056",      cat: 3, sub: "Mạch sạc",            part: "TP4056",          spec: "Sạc Li-ion 1A Type-C",          price: 12000,  tag: "hot", img: "images/mach-sac-tp4056.webp" },
  { name: "Pin Lipo 3.7V 1000mAh",cat: 3, sub: "Pin Lipo",            part: "LP503450",        spec: "Lipo 3.7V 1000mAh",             price: 68000,  tag: "", img: "images/pin-lipo-3-7v-1000mah.webp" },
  { name: "Mạch hạ áp LM2596",    cat: 3, sub: "Buck/Boost",          part: "LM2596",          spec: "Buck 3A chỉnh áp",              price: 28000,  tag: "", img: "images/mach-ha-ap-lm2596.webp" },
  { name: "Mỏ hàn 60W",           cat: 4, sub: "Mỏ hàn",              part: "SOLDER-60W",      spec: "Chỉnh nhiệt 200-450°C",         price: 189000, tag: "", img: "images/mo-han-60w.jpg" },
  { name: "Đồng hồ VOM DT830B",   cat: 4, sub: "Đồng hồ VOM",         part: "DT830B",          spec: "Đo V A Ω",                      price: 95000,  tag: "", img: "images/dong-ho-vom-dt830b.webp" },
  { name: "Breadboard 830 lỗ",    cat: 4, sub: "Dây Breadboard",      part: "MB-102",          spec: "Breadboard + rãnh nguồn",       price: 42000,  tag: "", img: "images/breadboard-830-lo.jpg" },
  { name: "PCB đục lỗ 5x7",       cat: 4, sub: "PCB",                 part: "PCB-5x7",         spec: "PCB hàn gói 5 tấm",             price: 25000,  tag: "", img: "images/pcb-duc-lo-5x7.webp" },
  { name: "Kẹp giữ mạch PCB",     cat: 4, sub: "Kẹp",                 part: "PCB-HOLDER",      spec: "Kẹp 2 đầu có kính lúp",         price: 78000,  tag: "", img: "images/kep-giu-mach-pcb.jpg" }
];

const COMBOS = [
  { name: "Combo Đồ án IoT nhà thông minh", desc: "ESP32 + DHT22 + relay + nguồn 5V",              price: 420000, old: 520000 },
  { name: "Combo Sinh viên học Arduino",    desc: "Uno R3 + breadboard + 120 dây jumper + LED",    price: 290000, old: 360000 },
  { name: "Combo Điện trở & tụ điện",       desc: "600 điện trở + 200 tụ các loại",                price: 180000, old: 230000 },
  { name: "Combo Hàn mạch cơ bản",          desc: "Mỏ hàn 60W + thiếc + nhựa thông + kẹp",         price: 250000, old: 310000 }
];

const POSTS = [
  { title: "Lập trình ESP32 gửi dữ liệu lên Wi-Fi trong 15 phút", tag: "Vi điều khiển" },
  { title: "Sơ đồ mạch nhấp nháy LED với NE555",                  tag: "Sơ đồ mạch" },
  { title: "Cách đọc giá trị điện trở qua vạch màu",              tag: "Kiến thức" },
  { title: "Chọn mạch hạ áp Buck cho dự án chạy pin",             tag: "Nguồn & Pin" }
];

const ORDERS = [
  { id: "#MV2609", date: "25/09/2026", total: "312.000 ₫", track: "GHN882015", step: 3 },
  { id: "#MV2588", date: "12/09/2026", total: "145.000 ₫", track: "GHN771002", step: 4 }
];
const ORDER_STEPS = ["Đã đặt", "Đóng gói", "Đang giao", "Đã giao"];
