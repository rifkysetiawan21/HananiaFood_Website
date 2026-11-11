tampilNavbar();

wajibLogin("admin"); tampilStatistik();
function isiKartu(p) {
  return `<p>Bukti: ${p.bukti}. Total pesanan ${rp(p.total)}.</p>
    <div class="row"><button class="kecil" onclick="terima(${p.id})">Terima</button>
    <button class="kecil bahaya" onclick="tolak(${p.id})">Tolak</button></div>`;
}
function tampil() {
  const antre = db.pesanan.filter(p => p.status === "Menunggu Verifikasi");
  document.getElementById("daftar").innerHTML = daftarPesanan(antre, isiKartu, "Tidak ada pembayaran yang perlu diverifikasi.");
}
function terima(id) { cariPesanan(id).status = "Diterima"; simpan(); toast("Pembayaran diterima"); tampilStatistik(); tampil(); }
function tolak(id) {
  const alasan = prompt("Alasan penolakan:");
  if (alasan === null) return;
  const p = cariPesanan(id); p.status = "Menunggu Pembayaran"; p.catatan = bersihkan(alasan) || "tidak sesuai";
  simpan(); tampilStatistik(); tampil();
}
tampil();
