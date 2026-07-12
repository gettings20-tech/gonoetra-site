/* Noetra analytics — GA4 conversion tracking.
 * ACTIVATE: set MEASUREMENT_ID to your GA4 id (e.g. 'G-XXXXXXXXXX').
 * Until then everything below is a safe no-op (no network calls, no errors).
 * Conversion events fired: 'lead_submit' (contact form) and 'demo_booked' (GHL calendar). */
(function () {
  'use strict';
  var MEASUREMENT_ID = ''; // <-- set to 'G-XXXXXXXXXX' to turn GA4 on

  // Safe tracker — no-ops until GA4 is active.
  window.noetraTrack = function (name, params) {
    try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) {}
  };

  // GHL booking widget completion -> demo_booked conversion.
  // Best-effort: GHL posts a message from the leadconnector iframe on booking.
  // Verify the exact payload in GA4 DebugView after go-live and tighten if needed.
  window.addEventListener('message', function (e) {
    try {
      if (!/leadconnector|gohighlevel|msgsndr/i.test(e.origin || '')) return;
      var d = e.data;
      var s = typeof d === 'string' ? d : JSON.stringify(d || '');
      if (/appointment|booking|slot.?book|scheduled/i.test(s)) {
        window.noetraTrack('demo_booked', { method: 'ghl_calendar' });
      }
    } catch (err) {}
  });

  if (!MEASUREMENT_ID) return; // GA4 not configured yet — stop here.

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(g);
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID);
})();
