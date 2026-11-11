(function () { const u = userAktif(); if (u) location.href = "index.html"; })();

function daftar(e) {
  e.preventDefault();
  const username = bersihkan(document.getElementById("ru").value);
  const sandi = document.getElementById("rp").value;
  if (sandi !== document.getElementById("rp2").value) { toast("Kata sandi dan ulangannya tidak sama"); return; }
  if (db.users.some(x => x.username === username)) { toast("Username sudah dipakai"); return; }
  db.users.push({ username: username, nama: bersihkan(document.getElementById("rn").value), password: sandi, role: "pelanggan", alamat: "" });
  db.sesi = username; simpan(); location.href = "index.html";
}

document.querySelector("form.f").addEventListener("submit", daftar);
siapkanFotoAuth();
