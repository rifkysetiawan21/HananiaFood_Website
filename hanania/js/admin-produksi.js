tampilNavbar();

wajibLogin("admin"); tampilStatistik();
function isiKartu(p) {
  if (p.status === "Diterima") return `<button class="kecil" onclick="ubahStatus(${p.id}, \x27Diproses\x27)">Mulai produksi</button>`;
  return `<button class="kecil alt" onclick="ubahStatus(${p.id}, \x27Siap Dikirim\x27)">Selesai, siap dikirim</button>`;
}
function tampil() {
  const antre = db.pesanan.filter(p => p.status === "Diterima" || p.status === "Diproses");
  document.getElementById("daftar").innerHTML = daftarPesanan(antre, isiKartu, "Belum ada pesanan yang siap diproduksi.");
}
function ubahStatus(id, status) { cariPesanan(id).status = status; simpan(); tampil(); }
tampil();
