document.addEventListener("DOMContentLoaded", function () {
   // Activate sidebar nav
   var elems = document.querySelectorAll(".sidenav");
   M.Sidenav.init(elems);
   loadNav();

   function loadNav() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
         if (this.readyState == 4) {
            if (this.status != 200) return;

            // Muat daftar tautan menu
            document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
               elm.innerHTML = xhttp.responseText;
            });

            // Daftarkan event listener untuk setiap tautan menu
            document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
               elm.addEventListener("click", function (event) {
                  // Tutup sidenav
                  var sidenav = document.querySelector(".sidenav");
                  M.Sidenav.getInstance(sidenav).close();

                  // Muat konten halaman yang dipanggil
                  page = event.target.getAttribute("href").substr(1);
                  loadPage(page);
               });
            });
         }
      };
      xhttp.open("GET", "nav.html", true);
      xhttp.send();
   }
   // Pada kode di atas kita mengaktifkan elemen sidebar bawaan framework Materialize agar dapat muncul saat burger menu diklik (baris 3-4). Kita juga memanggil fungsi loadNav() yang berisi kode AJAX menggunakan method XMLHttpRequest untuk mengambil isi dari berkas nav.html dan menyimpannya ke dalam elemen menu .topnav dan .sidenav.

   // Perhatian: Semua kode JavaScript kita simpan di dalam blok kode dari fungsi callback untuk event DOMContentLoaded untuk menjamin kode dijalankan setelah semua elemen pada dokumen html selesai dimuat.

   // Load page content
   var page = window.location.hash.substr(1);
   if (page == "") page = "home";
   loadPage(page);

   function loadPage(page) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
         if (this.readyState == 4) {
            var content = document.querySelector("#body-content");

            if (page === "saved") {
               getSavedTeams();
            } else if (page === "home") {
               getTeams();
            }

            if (this.status == 200) {
               content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
               content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
               content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
         }
      };
      xhttp.open("GET", "pages/" + page + ".html", true);
      xhttp.send();
   }

   // Pada kode di atas, kita mengambil terlebih dahulu hash dari url halaman sebagai nama halaman yang akan dipanggil. Misalnya kita buka url http://127.0.0.1:8887/#contact berarti kita mengakses halaman contact. Bila hash tidak ditemukan berarti halaman default yakni home yang akan ditampilkan. Kita memanggil fungsi loadPage() untuk memanggil konten dari berkas halaman menggunakan AJAX. Konten halaman kemudian akan disimpan ke dalam elemen .body-content. Bila halaman tidak ditemukan (status code 404) maka kita tampilkan elemen paragraf yang memberitahukan bahwa halaman yang dimaksud tidak ada pada daftar halaman yang tersedia. Berkas-berkas konten halaman disimpan di dalam folder pages/.
});