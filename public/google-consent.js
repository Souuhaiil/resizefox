/* Requires Ads AND Analytics consent mode in Google Privacy & messaging.
 * https://developers.google.com/funding-choices/fc-api-docs
 */
(() => {
  if (window.resizefoxConsent) return;
  const analyticsId = 'G-64KRV3M9TN';
  const adsId = 'AW-17041135809';
  const denied = { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', denied);
  window['ga-disable-' + analyticsId] = true;
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  let loaded = false;
  let ready = false;
  let revoking = false;

  function updateTags() {
    const status = window.googlefc.getGoogleConsentModeValues?.();
    const values = [status?.adStoragePurposeConsentStatus, status?.analyticsStoragePurposeConsentStatus,
      status?.adUserDataPurposeConsentStatus, status?.adPersonalizationPurposeConsentStatus];
    // GRANTED = 1, NOT_APPLICABLE = 3. Missing/unconfigured consent is blocked.
    const allowed = !revoking && values.every(value => value === 1 || value === 3);
    window['ga-disable-' + analyticsId] = !allowed;
    window.gtag('consent', 'update', allowed
      ? { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' }
      : denied);
    if (!allowed || loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);
    window.gtag('config', adsId);
    const script = document.createElement('script');
    script.id = 'google-tag';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + analyticsId;
    document.head.appendChild(script);
  }
  function queueUpdate() {
    window.googlefc.callbackQueue.push({ CONSENT_MODE_DATA_READY: updateTags });
  }
  window.resizefoxConsent = {
    isReady: () => ready,
    revoke: () => {
      if (!ready) return false;
      revoking = true;
      window['ga-disable-' + analyticsId] = true;
      window.gtag('consent', 'update', denied);
      window.googlefc.callbackQueue.push(() => window.googlefc.showRevocationMessage());
      return true;
    },
  };
  queueUpdate();
  window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => {
    ready = typeof window.googlefc.showRevocationMessage === 'function';
    window.dispatchEvent(new Event('resizefox-consent-ready'));
    if (typeof window.__tcfapi === 'function') {
      window.__tcfapi('addEventListener', 0, (data, success) => {
        if (success && data?.eventStatus === 'useractioncomplete') {
          revoking = false;
          // Let the CMP finish updating consent-mode values for this decision.
          setTimeout(queueUpdate, 0);
        }
      });
    }
  } });
  // Insert only after defaults exist. React may hoist an async JSX script
  // ahead of the synchronous consent initializer during static rendering.
  const adsense = document.createElement('script');
  adsense.async = true;
  adsense.crossOrigin = 'anonymous';
  adsense.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7594630679770960';
  document.head.appendChild(adsense);
})();
