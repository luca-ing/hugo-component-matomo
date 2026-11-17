'use strict';

var matomoUrl = document.querySelector('script[data-id="matomo-tracking"]').getAttribute('data-matomo-tracking-url');
var matomoSiteId = document.querySelector('script[data-id="matomo-tracking"]').getAttribute('data-matomo-tracking-id');

/* Pages may push events into the queue; with tracking off it is a plain array nobody reads. */
var _paq = window._paq = window._paq || [];

/* Matomo is not even loaded if the browser signals "do not track" or the visitor opted out. */
if (!matomoBrowserSignal() && !matomoStoredOptOut()) {
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['setTrackerUrl', matomoUrl + '/piwik.php']);
  _paq.push(['setSiteId', matomoSiteId]);

  (function () {
    var d = document;
    var g = d.createElement('script');
    var s = d.getElementsByTagName('script')[0];

    g.type = 'text/javascript';
    g.defer = true;
    g.src = matomoUrl + '/piwik.js';
    s.parentNode.insertBefore(g, s);
  })();
}
