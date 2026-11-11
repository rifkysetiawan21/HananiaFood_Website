tampilNavbar();

const user = wajibLogin("pelanggan");
document.getElementById("alamat").value = user.alamat || "";

function ambilKeranjang() { return (db.keranjang[user.username] || []).filter(i => cariMenu(i.id)); }

function tampil() {
  const k = ambilKeranjang();
  let html = "", total = 0;
  k.forEach(i => {
    const m = cariMenu(i.id), sub = hargaMenu(m) * i.jumlah;
    if (m.tersedia) total += sub;
    const info = m.tersedia ? `${rp(hargaMenu(m))} x ${i.jumlah} = ${rp(sub)}` : `<span class="lencana r">Menu sedang kosong. Hapus dari keranjang.</span>`;
    html += `<div class="item"><div class="k ${m.kategori.split(' ').pop()}"><img src="${fotoMenu(m)}" alt="" width="64" height="64" loading="lazy" data-kat="${m.nama.charAt(0)}"></div>
      <div><h3>${m.nama}</h3><p>${info}</p></div>
      <div class="aksi"><div class="row">
        <button class="kecil out" onclick="ubah(${i.id}, -1)">-</button><b>${i.jumlah}</b>
        <button class="kecil out" onclick="ubah(${i.id}, 1)">+</button></div>
      <button class="kecil bahaya" onclick="ubah(${i.id}, -999)">Hapus</button></div></div>`;
  });
  document.getElementById("isi").innerHTML = html || `<div class="kosong">Keranjang masih kosong. <a href="index.html">Pilih menu</a></div>`;
  document.getElementById("total").textContent = rp(total);
  pasangFotoCadangan(document.getElementById("isi"));
  document.getElementById("checkout").style.display = k.length ? "block" : "none";
}
function ubah(id, selisih) {
  const k = ambilKeranjang(), i = k.find(x => x.id === id);
  i.jumlah += selisih;
  db.keranjang[user.username] = k.filter(x => x.jumlah > 0);
  simpan(); tampil();
}
function buatPesanan(e) {
  e.preventDefault();
  if (ambilKeranjang().some(i => !cariMenu(i.id).tersedia)) { toast("Ada menu yang sedang kosong. Hapus dulu dari keranjang."); return; }
  const detail = ambilKeranjang().map(i => ({ nama: cariMenu(i.id).nama, jumlah: i.jumlah, harga: hargaMenu(cariMenu(i.id)) }));
  const total = detail.reduce((t, d) => t + d.harga * d.jumlah, 0);
  const alamat = bersihkan(document.getElementById("alamat").value);
  user.alamat = alamat;
  db.pesanan.push({
    id: db.nextPesanan, noInvoice: "INV-" + String(db.nextPesanan).padStart(4, "0"),
    pelanggan: user.username, namaPelanggan: user.nama, detail: detail, alamat: alamat,
    tanggal: new Date().toISOString(), total: total, metode: document.getElementById("metode").value,
    status: "Menunggu Pembayaran", bukti: "", catatan: "", kurir: "", jadwal: ""
  });
  db.nextPesanan++; db.keranjang[user.username] = [];
  simpan(); location.href = "pesanan.html";
}
tampil();

document.querySelector("form.f").addEventListener("submit", buatPesanan);
