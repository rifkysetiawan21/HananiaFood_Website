const STATUS = ["Menunggu Pembayaran", "Menunggu Verifikasi", "Diterima", "Diproses", "Siap Dikirim", "Dikirim", "Selesai"];

const DATA_AWAL = {
  sesi: null,
  nextPesanan: 1,
  nextMenu: 6,
  users: [
    { username: "admin", nama: "Admin Hanania", password: "123", role: "admin" },
    { username: "budi", nama: "Budi Santoso", password: "123", role: "pelanggan", alamat: "Jl. Ahmad Yani 10, Surabaya" },
    { username: "kurir", nama: "Rudi Kurir", password: "123", role: "kurir", kendaraan: "Motor" }
  ],
  menu: [
    { id: 1, nama: "Nasi Box Ayam Bakar", kategori: "Nasi Box", harga: 25000, deskripsi: "Nasi, ayam bakar, lalapan, sambal.", tersedia: true },
    { id: 2, nama: "Nasi Kuning Komplit", kategori: "Nasi Box", harga: 22000, deskripsi: "Nasi kuning, telur, serundeng, perkedel.", tersedia: true },
    { id: 3, nama: "Risoles Ragout", kategori: "Snack", harga: 5000, deskripsi: "Isi ragout ayam dan sayur.", tersedia: true },
    { id: 4, nama: "Es Teh Manis", kategori: "Minuman", harga: 4000, deskripsi: "Teh seduh dingin.", tersedia: true },
    { id: 5, nama: "Paket Rapat", kategori: "Paket", harga: 0, deskripsi: "Satu nasi box, satu snack, satu minuman.", tersedia: true, isi: [1, 3, 4], diskon: 10 }
  ],
  keranjang: {},
  pesanan: []
};

const KONTAK = { email: "halo@hanania-food.example" };
function kirimEmail(subjek) { location.href = "mailto:" + KONTAK.email + "?subject=" + encodeURIComponent(subjek); }

let db = JSON.parse(localStorage.getItem("hanania")) || DATA_AWAL;
function simpan() { localStorage.setItem("hanania", JSON.stringify(db)); perbaruiBadge(); }

const IKON_KERANJANG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>';
function perbaruiBadge() {
  const b = document.getElementById("badge-keranjang");
  if (!b) return;
  const u = userAktif();
  const n = u ? (db.keranjang[u.username] || []).filter(i => cariMenu(i.id)).reduce((t, i) => t + i.jumlah, 0) : 0;
  b.textContent = n > 99 ? "99+" : n;
  b.hidden = n === 0;
  const lbl = b.parentElement.parentElement.querySelector(".sr");
  if (lbl) lbl.textContent = n ? ", " + n + " item" : "";
}

function rp(angka) { return "Rp" + Math.round(angka).toLocaleString("id-ID"); }
function cariMenu(id) { return db.menu.find(m => m.id === id); }
function cariPesanan(id) { return db.pesanan.find(p => p.id === id); }
function bersihkan(teks) { return String(teks).replace(/[<>&"']/g, "").trim(); }

function fotoMenu(m) {
  const nama = m.foto || m.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";
  return "img/menu/" + nama;
}

function pasangFotoCadangan(akar) {
  akar.querySelectorAll("img[data-kat]").forEach(img => {
    const ganti = () => {
      const t = document.createElement("span");
      t.className = "stand"; t.textContent = img.dataset.kat;
      img.replaceWith(t);
    };
    if (img.complete && img.naturalWidth === 0) ganti(); else img.addEventListener("error", ganti, { once: true });
  });
}

function hargaMenu(m) {
  if (m.kategori !== "Paket") return m.harga;
  let total = 0;
  m.isi.forEach(id => { total += cariMenu(id).harga; });
  return total * (1 - m.diskon / 100);
}

function userAktif() { return db.users.find(u => u.username === db.sesi) || null; }
function wajibLogin(role) {
  const u = userAktif();
  if (!u || u.role !== role) { location.href = "login.html"; return null; }
  return u;
}
function siapkanFotoAuth() {
  const panel = document.querySelector(".auth-side"), foto = panel.querySelector("img");
  const tanpaFoto = () => panel.classList.add("tanpa-foto");
  if (foto.complete && foto.naturalWidth === 0) tanpaFoto(); else foto.addEventListener("error", tanpaFoto, { once: true });
}
function keluar() { db.sesi = null; simpan(); location.href = "index.html"; }

function toast(teks) {
  const t = document.getElementById("toast");
  t.textContent = teks; t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 2600);
}

function tampilNavbar() {
  const u = userAktif();
  let menu = [];
  if (!u) menu.push(["login.html", "Masuk"], ["daftar.html", "Daftar"]);
  if (u && u.role === "pelanggan") menu.push(["keranjang.html", "Keranjang"], ["pesanan.html", "Pesanan saya"]);
  if (u && u.role === "kurir") menu = [["kurir.html", "Tugas antar"]];
  if (u && u.role === "admin") menu = [["admin-menu.html", "Kelola menu"], ["admin-bayar.html", "Verifikasi bayar"], ["admin-produksi.html", "Produksi"], ["admin-kirim.html", "Pengiriman"], ["admin-laporan.html", "Laporan"]];
  const halaman = location.pathname.split("/").pop() || "index.html";
  let html = menu.map(([url, nama]) => {
    const isi = url === "keranjang.html"
      ? `<span class="ikon">${IKON_KERANJANG}<span class="badge" id="badge-keranjang" hidden>0</span></span>Keranjang<span class="sr"></span>`
      : nama;
    return `<a href="${url}" class="${url === halaman ? "on" : ""}${url === "daftar.html" ? " daftar" : ""}${url === "login.html" ? " masuk" : ""}"${url === halaman ? ' aria-current="page"' : ""}>${isi}</a>`;
  }).join("");
  if (u) html += `<button type="button" class="nav-keluar">Keluar (${u.nama})</button>`;
  const nav = document.getElementById("nav");
  document.body.classList.toggle("nav-ringkas", !u);
  nav.innerHTML = html;
  const keluarBtn = nav.querySelector(".nav-keluar");
  if (keluarBtn) keluarBtn.addEventListener("click", keluar);
  perbaruiBadge();

  const tombol = document.querySelector(".menu-btn");
  if (!tombol) return;
  function atur(buka) {
    document.body.classList.toggle("menu-buka", buka);
    tombol.setAttribute("aria-expanded", String(buka));
    tombol.textContent = buka ? "Tutup" : "Menu";
  }
  tombol.addEventListener("click", () => atur(tombol.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", e => { if (e.target.closest("a")) atur(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") atur(false); });
  window.matchMedia("(min-width: 961px)").addEventListener("change", e => { if (e.matches) atur(false); });
}

function kartuPesanan(p, isiTambahan) {
  const ringkas = p.detail.map(d => d.nama + " x" + d.jumlah).join(", ");
  const alur = STATUS.map(s => `<span class="${s === p.status ? "on" : ""}">${s}</span>`).join("");
  return `<div class="box">
    <div class="row sp"><b>${p.noInvoice} - ${p.namaPelanggan}</b><span class="lencana w">${p.status}</span></div>
    <div class="alur">${alur}</div>
    <p class="sub">${ringkas}. ${rp(p.total)}</p>${isiTambahan}</div>`;
}
function daftarPesanan(daftar, fungsiIsi, pesanKosong) {
  if (daftar.length === 0) return `<div class="kosong">${pesanKosong}</div>`;
  return daftar.map(p => kartuPesanan(p, fungsiIsi(p))).join("");
}

function tampilStatistik() {
  const selesai = db.pesanan.filter(p => p.status === "Selesai");
  const total = selesai.reduce((t, p) => t + p.total, 0);
  document.getElementById("stat").innerHTML =
    `<span>Total pesanan: <b>${db.pesanan.length}</b></span>
     <span>Menunggu verifikasi: <b>${db.pesanan.filter(p => p.status === "Menunggu Verifikasi").length}</b></span>
     <span>Penjualan selesai: <b>${rp(total)}</b></span>`;
}
