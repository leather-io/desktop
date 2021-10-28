import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

let analytics: Analytics | null = null;

export function initSegment() {
  const writeKey = process.env.SEGMENT_WRITE_KEY;

  if (writeKey) {
    AnalyticsBrowser.standalone(writeKey)
      .then(res => (analytics = res))
      .catch(console.error);
  } else {
    console.warn('segment init aborted: No WRITE_KEY setup.');
  }
}

export function getAnalytics() {
  return analytics;
}
