import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

let analytics: Analytics | null = null;

export function initSegment() {
  const writeKey = process.env.SEGMENT_WRITE_KEY;
  if (!writeKey) {
    console.warn('segment init aborted: No WRITE_KEY setup.');
    return;
  }

  AnalyticsBrowser.standalone(writeKey)
    .then(res => (analytics = res))
    .catch(console.error);
}

export function getAnalytics() {
  return analytics;
}
