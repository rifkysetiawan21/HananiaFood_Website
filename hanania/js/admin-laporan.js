tampilNavbar();

wajibLogin("admin"); tampilStatistik();
function tampil() {
  const hari = Number(document.getElementById("periode").value);
  const mulai = new Date(Date.now() - hari * 24 * 60 * 60 * 1000);
  const data = db.pesanan.filter(p => p.status === "Selesai" && new Date(p.tanggal) >= mulai);
  if (data.length === 0) { document.getElementById("isi").innerHTML = `<div class="kosong">Belum ada pesanan selesai pada periode ini.</div>`; return; }
  let baris = "", total = 0;
  data.forEach(p => { total += p.total; baris += `<tr><td>${p.noInvoice}</td><td>${p.namaPelanggan}</td><td>${rp(p.total)}</td></tr>`; });
  document.getElementById("isi").innerHTML = `<table><tr><th>Invoice</th><th>Pelanggan</th><th>Total</th></tr>${baris}
    <tr><th colspan="2">Total penjualan</th><th>${rp(total)}</th></tr></table>`;
}
tampil();

document.getElementById("periode").addEventListener("change", tampil);
document.getElementById("cetak").addEventListener("click", () => window.print());
