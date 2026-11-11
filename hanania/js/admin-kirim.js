tampilNavbar();

wajibLogin("admin"); tampilStatistik();
function isiKartu(p) {
  if (p.kurir) return `<p>Kurir: ${p.kurir}, jadwal ${p.jadwal}.</p>`;
  let opsi = "";
  db.users.filter(u => u.role === "kurir").forEach(u => { opsi += `<option>${u.nama}</option>`; });
  return `<div class="row"><select id="k${p.id}">${opsi}</select><input type="date" id="j${p.id}">
          <button class="kecil" onclick="tetapkan(${p.id})">Tetapkan kurir</button></div>`;
}
function tampil() {
  const antre = db.pesanan.filter(p => p.status === "Siap Dikirim" || p.status === "Dikirim");
  document.getElementById("daftar").innerHTML = daftarPesanan(antre, isiKartu, "Belum ada pesanan siap kirim.");
}
function tetapkan(id) {
  const p = cariPesanan(id);
  p.kurir = document.getElementById("k" + id).value;
  p.jadwal = document.getElementById("j" + id).value || new Date().toLocaleDateString("id-ID");
  simpan(); toast("Notifikasi dikirim ke " + p.kurir); tampil();
}
tampil();
