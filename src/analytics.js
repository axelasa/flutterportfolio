// Lightweight funnel tracking. Integrates with Plausible or GA4 when present
// and stays silent otherwise, so analytics can never break the page.
//
// To activate a provider, add its script to index.html. Events are named:
//   contact_form_started, contact_form_submitted, contact_form_failed,
//   whatsapp_click, cal_click, email_click, store_link_click,
//   case_study_open, case_study_cta, hero_cta_click

export function track(event, props) {
  try {
    if (typeof window === "undefined") return;
    window.plausible?.(event, { props });
    if (typeof window.gtag === "function") window.gtag("event", event, props);
  } catch {
    /* tracking must never break the experience */
  }
}

// Fires an event at most once per browser session (used for funnel steps
// such as "form started" so the numbers reflect people, not clicks).
export function trackOnce(event, props, storageKey = `seen-${event}`) {
  try {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    /* storage can be disabled; fall through and fire anyway */
  }
  track(event, props);
}
