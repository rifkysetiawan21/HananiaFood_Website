tampilNavbar();

const user = wajibLogin("pelanggan");
function instruksi(p) {
  if (p.metode === "QRIS") return "Pindai QRIS merchant Hanania Food dan bayar " + rp(p.total) + ".";
  return "Transfer " + rp(p.total) + " ke BCA 1234567890 a.n. Hanania Food.";
}
function isiKartu(p) {
  let html = "";
  if (p.status === "Menunggu Pembayaran") {
    html += `<p>${instruksi(p)}</p>`;
    if (p.catatan) html += `<p><span class="lencana r">Bukti ditolak: ${p.catatan}. Unggah ulang.</span></p>`;
    html += `<div class="row"><input type="file" id="f${p.id}" accept=".jpg,.jpeg,.png,.pdf">
             <button class="kecil" onclick="unggah(${p.id})">Unggah bukti</button></div>`;
  }
  if (p.kurir) html += `<p>Kurir: ${p.kurir}, jadwal ${p.jadwal}.</p>`;
  html += `<div class="row"><button class="kecil out" onclick="bantuan(\x27${p.noInvoice}\x27)">Hubungi admin</button></div>`;
  return html;
}
function tampil() {
  const milik = db.pesanan.filter(p => p.pelanggan === user.username).reverse();
  document.getElementById("daftar").innerHTML = daftarPesanan(milik, isiKartu, `Belum ada pesanan. <a href="index.html">Lihat menu</a>`);
}
function unggah(id) {
  const file = document.getElementById("f" + id).files[0];
  if (!file) { toast("Pilih file bukti dulu"); return; }
  if (!/\.(jpe?g|png|pdf)$/i.test(file.name)) { toast("Format file harus jpg, png, atau pdf"); return; }
  const p = cariPesanan(id);
  p.bukti = file.name; p.catatan = ""; p.status = "Menunggu Verifikasi";
  simpan(); toast("Bukti terkirim, menunggu verifikasi admin"); tampil();
}
function bantuan(invoice) {
  kirimEmail("Bantuan untuk pesanan " + invoice);
}
tampil();
