importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.setConfig({
   debug: false
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// set cache names
workbox.core.setCacheNameDetails({
   prefix: 'my',
   suffix: 'v1',
   precache: 'appshell',
});

// Precaching all assets first
// Automatic for event activite and fetch from cache
workbox.precaching.precacheAndRoute([
   'css/materialize.min.css',
   'js/idb.js',
   'js/materialize.min.js',
   'images/images_unavailable.png',
   {
      url: 'index.html',
      revision: '1'
   },
   {
      url: 'nav.html',
      revision: '1'
   },
   {
      url: 'team.html',
      revision: '1'
   },
   {
      url: 'manifest.json',
      revision: '1'
   },
   {
      url: 'css/style.css',
      revision: '1'
   },
   {
      url: 'js/api.js',
      revision: '1'
   },
   {
      url: 'js/db.js',
      revision: '1'
   },
   {
      url: 'js/index-script.js',
      revision: '1'
   },
   {
      url: 'js/nav.js',
      revision: '1'
   },
   {
      url: 'js/team-script.js',
      revision: '1'
   },
   {
      url: 'pages/home.html',
      revision: '1'
   },
   {
      url: 'pages/saved.html',
      revision: '1'
   }
], {
   // Ignore all URL parameters.
   ignoreURLParametersMatching: [/.*/],
});

// Clean Up Old Precaches
workbox.precaching.cleanupOutdatedCaches();

// Using stale while revalidate
workbox.routing.registerRoute(
   new RegExp("https://api.football-data.org/v2/.+"),
   new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'data',
      plugins: [
         new workbox.expiration.Plugin({
            // Max 100 entries
            maxEntries: 100,
            // Max 7 days caching
            maxAgeSeconds: 7 * 24 * 60 * 60,
         }),
      ],
   })
);

// Push event for notification
self.addEventListener('push', function (event) {
   var body;
   if (event.data) {
      body = event.data.text();
   } else {
      body = 'Pesan default.';
   }
   var options = {
      body: body,
      icon: 'images/icons/icon-128x128.png',
      vibrate: [100, 50, 100],
      data: {
         dateOfArrival: Date.now(),
         primaryKey: 1
      }
   };
   event.waitUntil(
      self.registration.showNotification('Pemberitahuan!', options)
   );
});