const dbPromised = idb.open("bolaidb", 1, function (upgradeDb) {
   var articlesObjectStore = upgradeDb.createObjectStore("teams", {
      keyPath: 'id',
      autoIncrement: true
   });
   articlesObjectStore.createIndex("name", "name", {
      unique: false
   });
});

function saveForLater(team) {
   dbPromised
      .then(function (db) {
         var tx = db.transaction("teams", "readwrite");
         var store = tx.objectStore("teams");
         store.put(team);
         return tx.complete;
      })
      .then(function () {
         M.toast({
            html: 'Berhasil disimpan.'
         });
         console.log("Data berhasil di simpan.");
      }).catch(function (error) {
         M.toast({
            html: 'Sudah disimpan di Favorit.'
         });
      });
}

function getAll() {
   return new Promise(function (resolve, reject) {
      dbPromised
         .then(function (db) {
            var tx = db.transaction("teams", "readonly");
            var store = tx.objectStore("teams");
            return store.getAll();
         })
         .then(function (teams) {
            resolve(teams);
         });
   });
}

function getById(id) {
   return new Promise(function (resolve, reject) {
      dbPromised
         .then(function (db) {
            var tx = db.transaction("teams", "readonly");
            var store = tx.objectStore("teams");
            console.log();
            return store.get(id);
         })
         .then(function (team) {
            resolve(team);
         }).catch(error => alert(error.message));
   });
}

function deleteById(id) {
   dbPromised
      .then(function (db) {
         var tx = db.transaction("teams", "readwrite");
         var store = tx.objectStore("teams");
         console.log(id);
         return store.delete(id);
      })
      .then(function (team) {
         M.toast({
            html: 'Berhasil dihapus.'
         })
         console.log("Data berhasil dihapus.");
         setInterval(function () {
            history.go(-1);
         }, 1000);

      }).catch(error => alert(error.message));
}