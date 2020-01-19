const base_url = 'https://api.football-data.org/v2/';

const fetchApi = function (base_url) {
  return fetch(base_url, {
    headers: {
      'X-Auth-Token': '749a1834689e4252807e43ceb684611e'
    }
  });
};
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log('Error : ' + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log('Error : ' + error);
}

function getTeams() {
  if ('caches' in window) {
    caches.match(base_url + 'teams').then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var teamHTML = '<h6 class="ctitle">Daftar Tim Yang Tersedia</h6>';
          showTeam(data.teams, teamHTML);
        });
      }
    });
  }

  fetchApi(base_url + 'teams')
    .then(status)
    .then(json)
    .then(function (data) {
      var teamHTML = '<h6 class="ctitle">Daftar Tim Yang Tersedia</h6>';
      showTeam(data.teams, teamHTML);
    }).catch(() => {
      document.getElementById('body-content').innerHTML = "<p>Halaman tidak dapat dimuat, periksa koneksi internet anda.</p>";
    });
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get('id');

    if ('caches' in window) {
      caches.match(base_url + 'teams/' + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log(response);
            showTeamById(data);
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(base_url + 'teams/' + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // console.log(data);
        console.log(data);
        showTeamById(data);
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      }).catch((e) => {
        document.getElementById('body-content').innerHTML = "<p>Halaman tidak dapat dimuat, periksa koneksi internet anda.</p>";
      });

  });

}

function getSavedTeams() {
  getAll().then(function (teams) {
    var teamHTML = '<div class="col s12"><h6 class="ctitle">Tim Favorit</h6></div>';

    if (teams.length === 0) {
      teamHTML += '<p class="center-align">Belum ada tim favorit</p>';
    } else {
      teams.forEach((team) => {
        teamHTML += `
        <div class="col s12 m6 l4">
      <a href="./team.html?id=${team.id}&saved=true" class="black-text">
          <div class="card ccard">
              <div class="row valign-wrapper">
                  <div class="col s4">
                      <div class="card-image waves-effect waves-block waves-light">
                          <img src="${checkImg(team.crestUrl)}" alt="Unavailable team logo!" class="responsive-img">
                      </div>
                  </div>
                  <div class="col s8 p-0">
                      <div class="card-content">
                          <span class="card-title truncate">${team.shortName}</span>
                          <p>${team.area.name} - ${team.tla}</p>
                      </div>
                  </div>
              </div>
          </div>
      </a>
      </div>
  `;
      });
    }
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById('teams').innerHTML = teamHTML;
  });

}

function getSavedTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get('id');

  getById(Number(idParam)).then(function (data) {
    showTeamById(data);
  });
}

function showTeam(teams, teamHTML) {
  teamHTML += `<div class="row">`;
  teams.forEach((team) => {
    teamHTML += `
    <div class="col s12 m6 l4">
    <a href="./team.html?id=${team.id}" class="black-text">
        <div class="card ccard">
            <div class="row valign-wrapper">
                <div class="col s4">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${checkImg(team.crestUrl)}" alt="Unavailable team logo!" class="responsive-img">
                    </div>
                </div>
                <div class="col s8 p-0">
                    <div class="card-content" style="padding-left: 0 !important;">
                        <span class="card-title truncate">${team.shortName}</span>
                        <p>${team.area.name} - ${team.tla}</p>
                    </div>
                </div>
            </div>
        </div>
    </a>
    </div>
`;
  });
  teamHTML += "</div>";
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById('body-content').innerHTML = teamHTML;
}

function showTeamById(data) {
  var articleHTML = `
    <div class="card mt-30 z-depth-0">
      <div class="card-content center-align">
        <span class="card-title m-0"><b>${data.name}</b></span>

        <p>${data.area.name} - ${data.shortName} (${data.tla})</p>

        <img src="${checkImg(data.crestUrl)}" alt="unavaliable team logo!" class="responsive-img mt-30" style="max-height: 150px !important;">

        <p class="mt-30">
          Berdiri pada tahun ${checkNull(data.founded)}.<br>
          Berlokasi di ${checkNull(data.address)}<br>
          ${checkNull(data.phone)}<br>
          ${checkNull(data.website)}<br>
          ${checkNull(data.email)+"<br>"}
          ${checkNull(data.clubColors)}<br>
          ${data.squad.length} Pemain
        </p>
      </div>
    </div>

    <h6 class="ctitle">Daftar Pemain</h6>
    `;

  articleHTML += '<div class="row">';

  var urut = 1;
  data.squad.forEach((squad) => {
    articleHTML += `
      <div class="col s12 m6 l4">
        <div class="card ccard white">
            <div class="card-content black-text">
            <p>
            <b>${urut++}. ${squad.name}</b><br>
            Nomor Punggung ${checkNull(squad.shirtNumber)}<br>
            ${checkNull(squad.position)}<br>
            ${squad.nationality}<br>
            </p>
          </div>
        </div>
      </div>
        `;
  })
  articleHTML += '</div>';
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById('body-content').innerHTML = articleHTML;

}

function checkNull(data) {
  return data != null ? data : "-";
}

function checkImg(data) {
  if (data == "" || data == null) {
    return "/images/images_unavailable.png";
  } else {
    return urlReplace(data);
  }
}

function urlReplace(url) {
  if (url.match('^http://')) {
    url = url.replace("http://", "https://")
  }
  return url;
}