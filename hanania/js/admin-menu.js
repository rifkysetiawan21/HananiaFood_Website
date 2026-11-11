tampilNavbar();

wajibLogin("admin"); tampilStatistik();
function tampil() {
  let html = "";
  db.menu.forEach(m => {
    html += `<tr><td>${m.nama}</td><td>${m.kategori}</td><td>${rp(hargaMenu(m))}</td>
      <td>${m.tersedia ? "Tersedia" : "Kosong"}</td>
      <td><button class="kecil out" onclick="ubahStatus(${m.id})">Ubah status</button>
          <button class="kecil bahaya" onclick="hapus(${m.id})">Hapus</button></td></tr>`;
  });
  document.getElementById("isi").innerHTML = html;
}
function tambahMenu(e) {
  e.preventDefault();
  db.menu.push({ id: db.nextMenu++, nama: bersihkan(document.getElementById("n").value), kategori: document.getElementById("k").value,
    harga: Number(document.getElementById("h").value), deskripsi: "Menu baru.", tersedia: true });
  simpan(); e.target.reset(); tampil();
}
function ubahStatus(id) { cariMenu(id).tersedia = !cariMenu(id).tersedia; simpan(); tampil(); }
function hapus(id) {

  const paket = db.menu.find(m => m.isi && m.isi.includes(id));
  if (paket) { toast("Tidak bisa dihapus: dipakai di " + paket.nama + ". Ubah status jadi Kosong saja."); return; }
  if (!confirm("Hapus menu ini?")) return;
  db.menu = db.menu.filter(m => m.id !== id);

  for (const u in db.keranjang) db.keranjang[u] = db.keranjang[u].filter(i => i.id !== id);
  simpan(); tampil();
}
tampil();

document.querySelector("form.bar").addEventListener("submit", tambahMenu);
