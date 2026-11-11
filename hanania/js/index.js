tampilNavbar();

function tampil() {
  const kata = document.getElementById("cari").value.toLowerCase();
  const kat = document.getElementById("kat").value;
  let html = "";
  db.menu.forEach(m => {
    if (!m.tersedia || !m.nama.toLowerCase().includes(kata) || (kat && m.kategori !== kat)) return;
    html += `<div class="kartu-menu">
      <div class="foto ${m.kategori.split(' ').pop()}"><img src="${fotoMenu(m)}" alt="${m.nama}" width="800" height="600" loading="lazy" data-kat="${m.kategori}"></div>
      <div class="isi"><h3>${m.nama}</h3><p>${m.deskripsi}</p>
        <div class="bawah"><span class="hrg">${rp(hargaMenu(m))}</span>
        <button class="kecil" onclick="tambah(${m.id})">Tambah ke keranjang</button></div></div></div>`;
  });
  document.getElementById("daftar").innerHTML = html ?
    `<div class="grid-menu">${html}</div>` : `<div class="kosong">Menu tidak ditemukan.</div>`;
  pasangFotoCadangan(document.getElementById("daftar"));
}
function tambah(id) {
  const u = userAktif();
  if (!u || u.role !== "pelanggan") { toast("Masuk sebagai pelanggan dulu untuk memesan."); setTimeout(() => { location.href = "login.html"; }, 1400); return; }
  db.keranjang[u.username] = db.keranjang[u.username] || [];
  const item = db.keranjang[u.username].find(i => i.id === id);
  if (item) item.jumlah++; else db.keranjang[u.username].push({ id: id, jumlah: 1 });
  simpan(); toast(cariMenu(id).nama + " masuk keranjang");
}
tampil();

(function () {
  const harga = db.menu.filter(m => m.tersedia && m.kategori === "Nasi Box").map(hargaMenu);
  if (harga.length) document.getElementById("harga-mulai").textContent = rp(Math.min(...harga));
  const hero = document.querySelector(".hero"), foto = document.getElementById("foto-hero");
  const tanpaFoto = () => hero.classList.add("tanpa-foto");
  if (foto.complete && foto.naturalWidth === 0) tanpaFoto(); else foto.addEventListener("error", tanpaFoto, { once: true });
})();

document.getElementById("cari").addEventListener("input", tampil);
document.getElementById("kat").addEventListener("change", tampil);
