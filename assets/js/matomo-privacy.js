'use strict';

/*
 * Opt-out state, shared by the tracking and the opt-out bundle (both include this file).
 * Nothing is stored unless the visitor opts out on the privacy page.
 */
var MATOMO_OPTOUT_KEY = 'matomo-optout';

/** True if the browser asks not to be tracked (Global Privacy Control or Do Not Track). */
function matomoBrowserSignal() {
  return navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1';
}

/** True if the visitor opted out on the privacy page. */
function matomoStoredOptOut() {
  try {
    return window.localStorage.getItem(MATOMO_OPTOUT_KEY) === '1';
  } catch (e) {
    return false;
  }
}

/** Store or clear the opt-out. Returns false if the browser refuses storage. */
function matomoSetOptOut(optOut) {
  try {
    if (optOut) {
      window.localStorage.setItem(MATOMO_OPTOUT_KEY, '1');
    } else {
      window.localStorage.removeItem(MATOMO_OPTOUT_KEY);
    }
    return true;
  } catch (e) {
    return false;
  }
}
