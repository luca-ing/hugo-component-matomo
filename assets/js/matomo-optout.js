'use strict';

/** Show the message and button that match the current state. */
function matomoOptOutRender(root) {
  var signal = matomoBrowserSignal();
  var optedOut = signal || matomoStoredOptOut();

  root.querySelector('.MatomoOptout-message--track').hidden = optedOut;
  root.querySelector('.MatomoOptout-message--block').hidden = !optedOut || signal;
  root.querySelector('.MatomoOptout-message--signal').hidden = !signal;
  root.querySelector('.MatomoOptout-button--block').hidden = optedOut;
  root.querySelector('.MatomoOptout-button--track').hidden = !optedOut || signal;
}

function matomoOptOutInit() {
  var root = document.querySelector('.MatomoOptout');
  if (!root) return;

  root.querySelector('.MatomoOptout-button--block').addEventListener('click', function () {
    if (!matomoSetOptOut(true)) {
      /* Storage refused: the opt-out cannot be remembered, so say so instead of silently failing. */
      root.querySelector('.MatomoOptout-message--nostorage').hidden = false;
      return;
    }
    /* The tracker loaded with this page keeps sending events until it is gone, and Matomo cannot
       be told to stop without a cookie. A reload brings the page back without it. */
    location.reload();
  });
  root.querySelector('.MatomoOptout-button--track').addEventListener('click', function () {
    matomoSetOptOut(false);
    matomoOptOutRender(root);
  });
  matomoOptOutRender(root);
}

if (document.readyState !== 'loading') {
  matomoOptOutInit();
} else {
  document.addEventListener('DOMContentLoaded', matomoOptOutInit);
}
