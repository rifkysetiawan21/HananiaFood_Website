const HALAMAN_AWAL = { pelanggan: "index.html", admin: "admin-menu.html", kurir: "kurir.html" };

(function () { const u = userAktif(); if (u) location.href = HALAMAN_AWAL[u.role]; })();

function masuk(e) {
  e.preventDefault();
  const u = db.users.find(x => x.username === bersihkan(document.getElementById("lu").value));
  if (!u || u.password !== document.getElementById("lp").value) { toast("Username atau kata sandi salah"); return; }
  db.sesi = u.username; simpan(); location.href = HALAMAN_AWAL[u.role];
}

function lupa() {
  window.open("https://wa.me/6281234567890?text=" + encodeURIComponent("Halo admin, saya lupa kata sandi. Mohon bantu reset akun saya."));
}

document.querySelector("form.f").addEventListener("submit", masuk);
document.querySelector("button.tautan").addEventListener("click", lupa);
siapkanFotoAuth();
