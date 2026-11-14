/* For the Lovers: shows turn alerts and opens the game when one is tapped. No offline caching. */
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {}; try { d = e.data.json(); } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const tag = d.tag || "turn";
  e.waitUntil(self.registration.showNotification(d.title || "For the Lovers", {
    body: d.body || "Your turn", tag, renotify: true, icon: "icon-192.png", badge: "icon-192.png",
    data: { url: self.registration.scope + "#go=" + encodeURIComponent(tag), tag } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const d = e.notification.data || {};
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.postMessage({ go: d.tag }); return c.focus(); } }
    return self.clients.openWindow(d.url || "./");
  }));
});
