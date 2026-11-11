tampilNavbar();

const user = wajibLogin("kurir");
document.getElementById("info").textContent = "Kendaraan: " + user.kendaraan;
function isiKartu(p) {
  let html = `<p>Alamat: ${p.alamat}. Jadwal ${p.jadwal}.</p>`;
  if (p.status === "Siap Dikirim") html += `<button class="kecil" onclick="ubahStatus(${p.id}, \x27Dikirim\x27)">Mulai kirim</button>`;
  if (p.status === "Dikirim") html += `<button class="kecil alt" onclick="ubahStatus(${p.id}, \x27Selesai\x27)">Konfirmasi diterima</button>`;
  return html;
}
function tampil() {
  const tugas = db.pesanan.filter(p => p.kurir === user.nama);
  document.getElementById("daftar").innerHTML = daftarPesanan(tugas, isiKartu, "Belum ada tugas antar.");
}
function ubahStatus(id, status) { cariPesanan(id).status = status; simpan(); tampil(); }
tampil();
